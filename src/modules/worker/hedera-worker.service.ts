import { OnchainStatus } from "../../shared/enums";
import * as _ from "lodash";
import {
  CurrencyConfig,
  LatestBlock,
  Governors,
  DAOMember
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
const logger = getLogger("HederaWorkerService");

const abi = JSON.parse(
  fs.readFileSync("./src/smart-contract/GovernorFactory.json", "utf8")
);
const web3 = new Web3();
export class HederaWorkerService {
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
    return await this.dataSource.transaction(async (manager) => {
      let latestBlockInDb = await manager
        .getRepository(LatestBlock)
        .createQueryBuilder("latest_block")
        .useTransaction(true)
        .where("latest_block.currency = :chain", { chain: "HBAR" })
        .getOne();
      console.log(latestBlockInDb);
      const contractId = "0.0.66510";
      const data = await this.getEventsFromMirror(contractId,latestBlockInDb.blockNumber,manager);

      for (const item of data) {
        if(item){
          const { governor, voteToken, timelock } = item;
          if (governor && voteToken && timelock) {
            await manager
              .createQueryBuilder()
              .update(Governors)
              .set({ status: 1 })
              .where(
                "address = :governor AND vote_token = :voteToken AND timelock_deterministic = :timelock and status = 0",
                { governor, voteToken, timelock}
              )
              .andWhere("block_number > :blockNumber", { blockNumber: latestBlockInDb.blockNumber })
              .execute();
          }

        }
      }

      return true;
    });
  }
  async getEventsFromMirror(contractId,blockNumber,manager) {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const dataEmit = [];
    const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractId.toString()}/results/logs?order=asc&timestamp=gt:${blockNumber}`;
    try {
      const response = await axios.get(url);
      const jsonResponse = response.data;
      console.log(0, jsonResponse);
      if(jsonResponse && jsonResponse.logs.length > 0){
        const timestamp = jsonResponse.logs[jsonResponse.logs.length- 1].timestamp;
        const timestampFloat = parseFloat(timestamp);
        const timestampInt = Math.floor(timestampFloat);
        console.log('timestampInt',timestampInt);
        await manager
        .createQueryBuilder()
        .update("latest_block")
        .set({ blockNumber: timestampInt })  
        .where("currency = :currency", { currency: 'HBAR' })
        .execute();
      }

      jsonResponse.logs.forEach((log) => {
        const event = this.decodeEvent("GovernorCreated", log.data, log.topics);
        if(event){
          dataEmit.push(event);
        }
      });
    } catch (err) {
      console.log("error", err);
    }
    return dataEmit;
  }

  decodeEvent = (eventName, log, topics) => {
    try {
      const eventAbi = abi.abi.find(
        (event) => event.name === eventName && event.type === "event"
      );
      let decodedLog;
      if (eventAbi) {
        decodedLog = web3.eth.abi.decodeLog(eventAbi.inputs, log, topics);
        console.log(decodedLog);
      }
      return JSON.parse(JSON.stringify(decodedLog));
    } catch (e) {
      console.log("error", e);
    }
  };
}
