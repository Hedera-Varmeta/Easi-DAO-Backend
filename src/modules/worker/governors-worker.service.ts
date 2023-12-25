import { OnchainStatus } from "../../shared/enums";
import * as _ from "lodash";
import {
  CurrencyConfig,
  LatestBlock,
  Governors,
  Proposal,
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
const logger = getLogger("GovernorsWorkerService");

const abi = JSON.parse(
  fs.readFileSync("./src/smart-contract/StandardGovernor.json", "utf8")
);
const web3 = new Web3();
export class GovernorsWorkerService {
  _addminAddress = null;
  public isStopped = false;
  public isDelisted = false;

  constructor(private readonly dataSource: DataSource) {
    this._setup();
  }

  async _setup() {
    try {
      let contractIds = await this.dataSource.transaction(async (manager) => {
        let governors = await manager
          .getRepository(Governors)
          .createQueryBuilder("governors")
          .select("governors.contract_id", "contractId")
          .where("governors.contract_id IS NOT NULL")
          .andWhere("governors.contract_id != :emptyString", {
            emptyString: "",
          })
          .andWhere("governors.status = 1")
          .getRawMany();

        return governors.map((governor) => governor.contractId);
      });

      console.log("contractIds", contractIds);
      this.doCrawlJob(contractIds);
    } catch (error) {
      console.error("Setup error:", error);
    }
  }

  async delay(t) {
    return new Promise((resolve) => setTimeout(resolve, t));
  }

  async doCrawlJob(contractIds) {
    do {
      try {
        if (contractIds && contractIds.length > 0) {
          for (const contractId of contractIds) {
            let isWaiting = await this.crawlData(contractId);
            if (isWaiting) {
              await this.delay(2000);
            } else {
              await this.delay(500); // 0.5 seconds, to avoid too many requests
            }
          }
        } else {
          break;
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
  async crawlData(contractId) {
    return await this.dataSource.transaction(async (manager) => {
      let latestBlockInDb = await manager
        .getRepository(LatestBlock)
        .createQueryBuilder("latest_block")
        .where("latest_block.currency = :chain", { chain: "Governors" })
        .useTransaction(true)
        .getOne();
      console.log(latestBlockInDb);
      const data = await this.getEventsFromMirror(
        contractId,
        latestBlockInDb.blockNumber
      );
      if (data && data.length > 0) {
        await manager
          .createQueryBuilder()
          .update(Proposal)
          .set({ status: 1 })
          .where(
            "proposal_id = :proposalId and status = 0",
            { proposalId :  data[0].proposalId}
          )
          .execute();
      }
      return true;
    });
  }

  async getEventsFromMirror(contractId, blockNumber) {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(10000);
    const dataEmit = [];
    const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractId.toString()}/results/logs?order=desc&timestamp=gt:${blockNumber}`;
    try {
      const response = await axios.get(url);
      const jsonResponse = response.data;
      jsonResponse.logs.forEach((log) => {
        const event = this.decodeEvent("ProposalCreated", log.data, log.topics);
        if (event) {
          dataEmit.push(event);
        }
      });
    } catch (err) {}
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
      }
      return JSON.parse(JSON.stringify(decodedLog));
    } catch (e) {
    }
  };
}
