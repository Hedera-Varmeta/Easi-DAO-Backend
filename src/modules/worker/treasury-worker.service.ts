import { OnchainStatus } from "../../shared/enums";
import * as _ from "lodash";
import {
  CurrencyConfig,
  LatestBlock,
  Governors,
  Proposal,
  DAOMember,
  DAO,
  TokenTransfer,
  DAOTreasury,
  TypeTreasury,
  TreasuryTransaction
} from "../../database/entities";
import { getLogger } from "../../shared/logger";
import { DataSource, getConnection, LessThanOrEqual } from "typeorm";
import * as ethereumjs from "@ethereumjs/tx";
import pLimit from "p-limit";
import { Type } from "class-transformer";
import e from "express";

const NodeCache = require("node-cache");
const BATCH_LIMIT = 20;

const EthereumTx = ethereumjs.Transaction;
const Web3 = require("web3");
const fs = require("fs");
const axios = require("axios");
const logger = getLogger("TreasuryWorkerService");

const abi = JSON.parse(
  fs.readFileSync("./src/smart-contract/ERC20VotesStandard.json", "utf8")
);

const abi721 = JSON.parse(
  fs.readFileSync("./src/smart-contract/ERC721VotesStandard.json", "utf8")
);


const abi1155 = JSON.parse(
  fs.readFileSync("./src/smart-contract/ERC1155Instance.json", "utf8")
);

const web3 = new Web3();
export class TreasuryWorkerService {
  _addminAddress = null;
  public isStopped = false;
  public isDelisted = false;

  constructor(private readonly dataSource: DataSource) {
    this._setup();
  }

  async _setup() {
    this.doCrawlJob();
  }

  async delay(t) {
    return new Promise((resolve) => setTimeout(resolve, t));
  }

  async doCrawlJob() {
    do {
      try {
        let isWaiting = await this.crawlData();
        if (isWaiting) {
          await this.delay(2000);
        } else {
          await this.delay(500); // 0.5 seconds, to avoid too many requests
        }
      } catch (e) {
        console.log(e);
      }
    } while (true);
  }

  /**
   * Step 1: Get the data from the blockchain
   * @returns {Promise<void>}
   */
  async crawlData() {
    try {
      const treasurysData = await this.dataSource.transaction(async (manager) => {
        let daoTreasury = await manager
        .getRepository(DAOTreasury)
        .createQueryBuilder("dao_treasury")
        .leftJoinAndSelect(TypeTreasury, "type_treasury", "type_treasury.id = dao_treasury.typeId")
        .select([
          "dao_treasury.id as id",
          "dao_treasury.daoId as daoId",
          "dao_treasury.token as token",
          "dao_treasury.typeId as typeId",
          "type_treasury.typeName as typeName",
          "dao_treasury.isCrawl as isCrawl"
        ])
        .where("dao_treasury.isCrawl = :isCrawl", {
          isCrawl: 0,
        })
        .execute();
        return daoTreasury;
      });
      console.log("treasurysData", treasurysData);
      if (treasurysData && treasurysData.length > 0) {
        for (const treasuryData of treasurysData) {
          await this.crawlDataDetail(treasuryData);
        }
      }
    } catch (e) {
      console.log("error", e);
    }
    return true ;
  }

  async crawlDataDetail(treasuryData) {
    await this.dataSource.transaction(async (manager) => {
      const toBlock = new Date().getTime() / 1000;
      const latestBlockInDb = await manager
        .getRepository(LatestBlock)
        .createQueryBuilder("latest_block")
        .where("latest_block.currency = :chain", {
          chain: `Treasury_${treasuryData.daoId}_${treasuryData.token}`,
        })
        .getOne();
      let typeTreasury = 1;
      if(treasuryData.typeName === 'ERC20'){
        typeTreasury = 1;
      }else if(treasuryData.typeName === 'ERC721'){
        typeTreasury = 2;
      }else{
        typeTreasury = 3;
      }

      const data = await this.getEventsFromMirror(
        treasuryData,
        latestBlockInDb ? latestBlockInDb.blockNumber : toBlock,
        toBlock,
        typeTreasury
      );
     

      if (data && data.length > 0) {
        for (const item of data) {
          try {
            await this.tokenTransferEvent(item, manager);
          } catch (e) {
            console.log("error", e);
          }
        }
      }
      if (latestBlockInDb && data && data.length > 0) {
        latestBlockInDb.blockNumber = toBlock.toString();
        await manager.save(latestBlockInDb);
        await manager.getRepository(DAOTreasury).update(
          { id: treasuryData.id },
          { isCrawl: true }
        );
      }
    });
    return true;
  }

  async tokenTransferEvent(data: any, manager: any) {
    console.log("tokenTransferEvent", data);

    // Save tokenTransferEvent
    let treasuryTransaction = new TreasuryTransaction();
    treasuryTransaction.fromAddress = data.from;
    treasuryTransaction.toAddress = data.to;
    treasuryTransaction.amount = data.value ? data.value : (data.tokenId ? data.tokenId : 0);
    treasuryTransaction.timestamp = data.blockNumber;
    treasuryTransaction.tokenId = data.daoId;
    treasuryTransaction.predictTreasury = data.predictTreasury;
    console.log("tokenTransfer", treasuryTransaction);
    treasuryTransaction = await manager.save(treasuryTransaction);

    return true;
  }

  async getEventsFromMirror(
    treasuryData, 
    blockNumber, 
    toBlock,
    typeTreasury
    ) {
    const dataEmit = [];
    let url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${treasuryData.token}/results/logs?order=desc`;
    if(treasuryData.isCrawl){
     url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${treasuryData.voteToken}/results/logs?order=desc&timestamp=gt:${blockNumber}&timestamp=lt:${toBlock}`;
    }
     try {
      const response = await axios.get(url);
      const jsonResponse = response.data;
      console.log("jsonResponse", jsonResponse);
      jsonResponse.logs.forEach((log) => {
        log.topics.splice(0, 1);
        const event = this.decodeEvent(
          "Transfer",
          log.data,
          log.topics,
          blockNumber,
          treasuryData,
          typeTreasury
        );

        if (event) {
          dataEmit.push(event);
        }
      });
    } catch (err) {
    }

    return dataEmit;
  }

  decodeEvent = (eventName, log, topics, blockNumber, treasuryData,typeTreasury) => {
    try {
      let eventAbi = null;
      let decodedLog;
      if(typeTreasury === 1){
        eventAbi = abi.abi.find(
          (event) => event.name === eventName && event.type === "event"
        );
      }else if(typeTreasury === 2){
        eventAbi = abi721.abi.find(
          (event) => event.name === eventName && event.type === "event"
        );
      }else{
        eventAbi = abi1155.abi.find(
          (event) => event.name === eventName && event.type === "event"
        );
      }
      if (eventAbi) {
        decodedLog = web3.eth.abi.decodeLog(eventAbi.inputs, log, topics);
      }


      decodedLog.eventName = eventName;
      decodedLog.timestamp = new Date().getTime();
      decodedLog.blockNumber = blockNumber;
      decodedLog.predictTreasury = treasuryData.token;
      decodedLog.daoId = treasuryData.daoId;
      return JSON.parse(JSON.stringify(decodedLog));
    } catch (e) {
    }
  };
}
