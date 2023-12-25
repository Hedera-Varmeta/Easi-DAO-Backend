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
} from "../../database/entities";
import { getLogger } from "../../shared/logger";
import { DataSource, getConnection, LessThanOrEqual } from "typeorm";
import * as ethereumjs from "@ethereumjs/tx";
import pLimit from "p-limit";

const NodeCache = require("node-cache");
const BATCH_LIMIT = 20;

const EthereumTx = ethereumjs.Transaction;
const Web3 = require("web3");
const fs = require("fs");
const axios = require("axios");
const logger = getLogger("TransferWorkerService");

const abi = JSON.parse(
  fs.readFileSync("./src/smart-contract/ERC20VotesStandard.json", "utf8")
);

const abi721 = JSON.parse(
  fs.readFileSync("./src/smart-contract/ERC721VotesStandard.json", "utf8")
);
const web3 = new Web3();
export class TransferWorkerService {
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
      const governorsData = await this.dataSource.transaction(async (manager) => {
        let governors = await manager
        .getRepository(Governors)
        .createQueryBuilder("governors")
        .select("governors.contract_id", "contractId")
        .leftJoin(DAO, "dao", "dao.governor_id = governors.id")
        .addSelect("governors.id", "id")
        .addSelect("governors.vote_token", "voteToken")
        .addSelect("dao.id", "daoId")
        .where("governors.vote_token IS NOT NULL")
        .andWhere("governors.vote_token != :emptyString", {
          emptyString: "",
        })
        .andWhere("governors.is_crawl = :isCrawl", {
          isCrawl: false,
        })
        .getRawMany();

        return governors;
      });

      if (governorsData && governorsData.length > 0) {
        for (const governorData of governorsData) {
          await this.crawlDataDetail(governorData);
        }
      }
    } catch (e) {
      console.log("error", e);
    }
    return true ;
  }

  async crawlDataDetail(governorData) {
    await this.dataSource.transaction(async (manager) => {
      const toBlock = new Date().getTime() / 1000;
      const latestBlockInDb = await manager
        .getRepository(LatestBlock)
        .createQueryBuilder("latest_block")
        .where("latest_block.currency = :chain", {
          chain: `Membership_${governorData.voteToken}`,
        })
        .getOne();

      const data = await this.getEventsFromMirror(
        governorData,
        latestBlockInDb ? latestBlockInDb.blockNumber : toBlock,
        toBlock
      );
      console.log(3, data)
      if (data && data.length > 0) {
        for (const item of data) {
          try {
            await this.tokenTransferEvent(item, manager);
          } catch (e) {
            console.log("error", e);
          }
        }
      }
      console.log("here", latestBlockInDb, data);
      if (latestBlockInDb && data && data.length > 0) {
        latestBlockInDb.blockNumber = toBlock.toString();
        await manager.save(latestBlockInDb);

        await manager.getRepository(Governors).update(
          { id: governorData.id },
          { isCrawl: true }
        );
      }
    });
    return true;
  }

  async tokenTransferEvent(data: any, manager: any) {
    console.log("tokenTransferEvent", data);

    // Save tokenTransferEvent
    let tokenTransfer = new TokenTransfer();
    tokenTransfer.fromAddress = data.from;
    tokenTransfer.toAddress = data.to;
    tokenTransfer.amount = data.value ? data.value : (data.tokenId ? data.tokenId : 0);
    tokenTransfer.timestamp = data.blockNumber;
    tokenTransfer.tokenId = data.daoId;
    console.log("tokenTransfer", tokenTransfer);
    tokenTransfer = await manager.save(tokenTransfer);

    try {
      if (data.from === "0x0000000000000000000000000000000000000000") {
        const daoMember = new DAOMember();
        daoMember.daoId = data.daoId;
        daoMember.roleId = 2;
        daoMember.memberAddress = data.to;
        daoMember.memberName = data.to;
        await manager.save(daoMember);
      }
    } catch (error) {
      console.log("error", error);
    }

    return true;
  }

  async getEventsFromMirror(governorsData, blockNumber, toBlock) {
    console.log("getEventsFromMirror", governorsData);
    const dataEmit = [];
    const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${governorsData.voteToken}/results/logs?order=desc&timestamp=gt:${blockNumber}&timestamp=lt:${toBlock}`;
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
          governorsData.contractId,
          governorsData.daoId
        );

        if (event) {
          dataEmit.push(event);
        }
      });
    } catch (err) {
    }

    return dataEmit;
  }

  decodeEvent = (eventName, log, topics, blockNumber, contractId, daoId) => {
    try {
      const eventAbi = abi.abi.find(
        (event) => event.name === eventName && event.type === "event"
      );
      let decodedLog;
      if (eventAbi) {
        decodedLog = web3.eth.abi.decodeLog(eventAbi.inputs, log, topics);
      }
      decodedLog.eventName = eventName;
      decodedLog.timestamp = new Date().getTime();
      decodedLog.blockNumber = blockNumber;
      decodedLog.contractId = contractId;
      decodedLog.daoId = daoId;
      return JSON.parse(JSON.stringify(decodedLog));
    } catch (e) {
    }
  };
}
