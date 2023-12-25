import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Governors,
  User,
  DAO,
  Proposal,
  VoteOption,
  Vote,
  VoteHistory,
  DAOMember,
} from "../../database/entities";
import { Repository } from "typeorm";
import {
  createProposalRequestDto,
  createVoteOption,
  createVoteRequestDto,
  createVoteProposalRequestDto,
} from "./request/proposalRequest.dto";
import { async } from "rxjs";
import { PaginationResponse } from "src/config/rest/paginationResponse";
import {
  getArrayPaginationBuildTotal,
  getOffset,
  getPaginationBuildTotal,
} from "src/shared/Utils";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { S3 } from "aws-sdk";
import { ApiCauses } from "../../config/exception/apiCauses";

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
    @InjectRepository(VoteOption)
    private readonly voteOptionRepository: Repository<VoteOption>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(VoteHistory)
    private readonly voteHistoryRepository: Repository<VoteHistory>,
    @InjectRepository(DAOMember)
    private readonly daoMemberRepository: Repository<DAOMember>
  ) {}

  async voteOptionProposal(createVoteOption: createVoteOption, request: any) {
    const voteOption = new VoteOption();
    voteOption.name = createVoteOption.name;
    voteOption.description = createVoteOption.description;
    voteOption.voteId = createVoteOption.voteId;
    return await this.voteOptionRepository.save(voteOption);
  }

  async createProposal(
    createProposalDto: createProposalRequestDto,
    request: any,
    file: any
  ) {

    const proposal = new Proposal();
    proposal.daoId = createProposalDto.daoId;
    proposal.proposalTitle = createProposalDto.proposalTitle;
    proposal.proposalDescription = createProposalDto.proposalDescription;
    proposal.proposalStatus = createProposalDto.proposalStatus;
    proposal.proposalDeadline = createProposalDto.proposalDeadline;
    proposal.proposalSnapshot = createProposalDto.proposalSnapshot;
    proposal.calldatas = createProposalDto.calldatas;
    proposal.actionName = createProposalDto.actionName;
    proposal.encodeData = createProposalDto.encodeData;
    proposal.values = createProposalDto.values;
    proposal.addressArr = createProposalDto.addressArr;
    proposal.valueArr = createProposalDto.valueArr;
    proposal.encodeArr = createProposalDto.encodeArr;
    proposal.data = createProposalDto.data;
    proposal.proposalId = createProposalDto.proposalId;

    let dataIpfs = null;
    if (file) {
      const upload = await this.upload(file);

      dataIpfs = await this.uploadOnIpfs(file);
      if (!upload || !upload.Location) return false;
      proposal.imageUrl = upload.Location;

      const dataIpfsMetaData = await this.uploadMetaDataOnIPFS(proposal, dataIpfs);
      proposal.metaData = dataIpfsMetaData.IpfsHash;
    }
    if (createProposalDto.proposalVotesId) {
      proposal.proposalVotesId = createProposalDto.proposalVotesId;
    } else {
      const vote = new Vote();
      vote.name = "Default";
      vote.description = "Default";
      await this.voteRepository.save(vote);
      console.log(vote);

      const votesOptionToSave = [
        { name: "Against", description: "Against", voteId: vote.id, enumSC: 0 },
        { name: "For", description: "For", voteId: vote.id, enumSC: 1 },
        { name: "Abstain", description: "Abstain", voteId: vote.id, enumSC: 2 },
      ];

      const voteOptionEntities = votesOptionToSave.map((voteOptionData) => {
        const voteOption = new VoteOption();
        voteOption.name = voteOptionData.name;
        voteOption.description = voteOptionData.description;
        voteOption.voteId = voteOptionData.voteId;
        voteOption.enumSC = voteOptionData.enumSC;
        return voteOption;
      });
      console.log(voteOptionEntities);
      await this.voteOptionRepository.save(voteOptionEntities);

      proposal.proposalVotesId = vote.id;
    }
    return await this.proposalRepository.save(proposal);
  }


  async uploadMetaDataOnIPFS(data: any,dataIpfs: any) {
    var axios = require("axios");

    var dataPost = JSON.stringify({
      pinataContent: {
        name: data.name,
        description: data.description,
        image: process.env.IPFS_PATH + dataIpfs.IpfsHash,
      },
    });

    var config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
      data: dataPost,
    };
    try {
      const res = await axios(config);
      return {
        IpfsHash: res.data.IpfsHash,
      };
    } catch (error) {
      throw ApiCauses.ERROR_IPFS;
    }

  }

  async uploadOnIpfs(file: any) {
    return await this.uploadIpfsOnPinata(file);
  }


  async uploadIpfsOnPinata(file: any) {
    const axios = require("axios");
    const FormData = require("form-data");
    const { Readable } = require("stream");

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();

    const stream = Readable.from(file.buffer);
    const filename = `${Date.now()}_${file.originalname}`;
    stream.path = filename;

    data.append("file", stream);

    try {
      const res = await axios.post(url, data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary= ${data._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      });

      return {
        IpfsHash: res.data.IpfsHash,
      };
    } catch (error) {
      console.log("uploadIpfsOnPinata::error", error);
      throw ApiCauses.ERROR_IPFS;
    }
  }


  async getVoteOptionProposal(id: number) {
    const queryBuilder = this.voteOptionRepository
      .createQueryBuilder("voteOption")
      .select([
        "voteOption.id as id",
        "voteOption.name as name",
        "voteOption.description as description",
        "voteOption.voteId as voteId",
        "voteOption.enumSC as enumSC",
      ])
      .where("voteOption.id = :id", { id: id })
      .execute();
    return queryBuilder;
  }

  async updateVoteOptionProposal(
    id: number,
    createVoteOption: createVoteOption,
    request: any
  ) {
    const voteOption = await this.voteOptionRepository.findOne({
      where: { id: Number(id) },
    });
    voteOption.name = createVoteOption.name;
    voteOption.description = createVoteOption.description;
    return await this.voteOptionRepository.save(voteOption);
  }

  async deleteVoteOptionProposal(id: number) {
    const voteOption = await this.voteOptionRepository.findOne({
      where: { id: Number(id) },
    });
    return await this.voteOptionRepository.remove(voteOption);
  }

  async listVoteOptionProposal(
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<VoteOption>> {
    const queryBuilder = this.voteOptionRepository
      .createQueryBuilder("voteOption")
      .leftJoinAndSelect(Vote, "vote", "vote.id = voteOption.voteId")
      .select([
        "voteOption.id as id",
        "voteOption.name as name",
        "voteOption.description as description",
        "voteOption.voteId as voteId",
        "voteOption.enumSC as enumSC",
        "vote.name as voteName",
        "vote.description as voteDescription",
      ])

      .orderBy("voteOption.id", "DESC");

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async voteProposal(createVoteRequestDto: createVoteRequestDto, request: any) {
    const vote = new Vote();
    vote.name = createVoteRequestDto.name;
    vote.description = createVoteRequestDto.description;
    return await this.voteRepository.save(vote);
  }

  async listVoteProposal(
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<VoteOption>> {
    const queryBuilder = this.voteRepository
      .createQueryBuilder("vote")
      .select([
        "vote.id as id",
        "vote.name as name",
        "vote.description as description",
      ])
      .orderBy("vote.id", "DESC");

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async getVoteProposal(id: number) {
    const voteData = await this.voteRepository
      .createQueryBuilder("vote")
      .select([
        "vote.id as id",
        "vote.name as name",
        "vote.description as description",
      ])
      .where("vote.id = :id", { id: id })
      .execute();

    console.log(voteData);

    const voteOptionData = await this.voteRepository
      .createQueryBuilder("vote")
      .leftJoinAndSelect(
        VoteOption,
        "voteOption",
        "vote.id = voteOption.voteId"
      )
      .select([
        "voteOption.id as voteOptionId",
        "voteOption.name as voteOptionName",
        "voteOption.description as voteOptionDescription",
        "voteOption.voteId as voteId",
        "voteOption.enumSC as enumSC",
      ])
      .where("vote.id = :id", { id: id })
      .execute();
    return { voteData, voteOptionData: voteOptionData };
  }

  async updateVoteProposal(
    id: number,
    createVoteRequestDto: createVoteRequestDto,
    request: any
  ) {
    const vote = await this.voteRepository.findOne({
      where: { id: Number(id) },
    });
    vote.name = createVoteRequestDto.name;
    vote.description = createVoteRequestDto.description;
    return await this.voteRepository.save(vote);
  }

  async updateProposal(
    id: number,
    createProposalDto: createProposalRequestDto,
    request: any
  ) {
    const proposal = await this.proposalRepository.findOne({
      where: { id: Number(id) },
    });
    proposal.daoId = createProposalDto.daoId;
    proposal.proposalTitle = createProposalDto.proposalTitle;
    proposal.proposalDescription = createProposalDto.proposalDescription;
    proposal.proposalStatus = createProposalDto.proposalStatus;
    proposal.proposalVotesId = createProposalDto.proposalVotesId;
    proposal.proposalDeadline = createProposalDto.proposalDeadline;
    proposal.proposalSnapshot = createProposalDto.proposalSnapshot;
    proposal.calldatas = createProposalDto.calldatas;
    proposal.actionName = createProposalDto.actionName;
    proposal.encodeData = createProposalDto.encodeData;
    proposal.values = createProposalDto.values;
    proposal.proposalId = createProposalDto.proposalId;

    return await this.proposalRepository.save(proposal);
  }

  async deleteVoteProposal(id: number) {
    const vote = await this.voteRepository.findOne({
      where: { id: Number(id) },
    });
    return await this.voteRepository.remove(vote);
  }

  async deleteProposal(id: number) {
    const proposal = await this.proposalRepository.findOne({
      where: { id: Number(id) },
    });
    return await this.proposalRepository.remove(proposal);
  }

  async getProposal(id: number) {
    const queryBuilder = this.proposalRepository
      .createQueryBuilder("proposal")
      .leftJoinAndSelect(DAO, "dao", "proposal.daoId = dao.id")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(Vote, "vote", "vote.id = proposal.proposalVotesId")
      .leftJoinAndSelect(VoteHistory, "voteHistory", "voteHistory.proposalId = proposal.id")
      .leftJoinAndSelect(VoteOption, "voteOption", "voteOption.id = voteHistory.voteOptionId")
      .leftJoinAndSelect(DAOMember, "daoMember", "daoMember.daoId = dao.id AND daoMember.roleId = 1")
      .leftJoinAndSelect(User, "user", "user.wallet = daoMember.memberAddress")
      .select([
        "proposal.id as id",
        "proposal.daoId as daoId",
        "proposal.proposalTitle as proposalTitle",
        "proposal.proposalDescription as proposalDescription",
        "proposal.proposalId as proposalId",
        "proposal.proposalStatus as proposalStatus",
        "proposal.proposalVotesId as  proposalVotesId",
        "proposal.proposalCreatedAt as proposalCreatedAt",
        "proposal.proposalUpdatedAt as proposalUpdatedAt",
        "proposal.proposalDeadline as proposalDeadline",
        "proposal.proposalSnapshot as proposalSnapshot",
        "proposal.calldatas as calldatas",
        "proposal.actionName as actionName",
        "proposal.encodeData as encodeData",
        "proposal.imageUrl as imageUrl",
        "proposal.metaData as metaData",
        "proposal.values as proposalValues",
        "proposal.addressArr as addressArr",
        "proposal.valueArr as valueArr",
        "proposal.encodeArr as encodeArr",
        "proposal.data as data",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "vote.name as voteName",
        "vote.description as voteDescription",
        "user.wallet as userWallet",
        "user.accountId as userAccountId",
        "user.avatarUrl as userAvatarUrl",
        "user.username as userUsername",
        "COUNT(voteHistory.id) as totalVotes",
        "COUNT(CASE WHEN voteOption.name = 'For' THEN voteHistory.id ELSE NULL END) as totalFor",
        "COUNT(CASE WHEN voteOption.name = 'Against' THEN voteHistory.id ELSE NULL END) as totalAgainst",
        "COUNT(CASE WHEN voteOption.name = 'Abstain' THEN voteHistory.id ELSE NULL END) as totalAbstain"
      ])
      .where("proposal.id = :id", { id: id })
      .groupBy("proposal.id")
      .addOrderBy("proposal.id", "DESC")
      .execute();
    return queryBuilder;
  }

  async listProposal(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<Proposal>> {
    const queryBuilder = this.proposalRepository
      .createQueryBuilder("proposal")
      .leftJoinAndSelect(DAO, "dao", "proposal.daoId = dao.id")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(Vote, "vote", "vote.id = proposal.proposalVotesId")
      .leftJoinAndSelect(VoteHistory, "voteHistory", "voteHistory.proposalId = proposal.id")
      .leftJoinAndSelect(VoteOption, "voteOption", "voteOption.id = voteHistory.voteOptionId")
      .leftJoinAndSelect(DAOMember, "daoMember", "daoMember.daoId = dao.id AND daoMember.roleId = 1")
      .leftJoinAndSelect(User, "user", "user.wallet = daoMember.memberAddress")
      .select([
        "proposal.id as id",
        "proposal.daoId as daoId",
        "proposal.proposalTitle as proposalTitle",
        "proposal.proposalDescription as proposalDescription",
        "proposal.proposalId as proposalId",
        "proposal.proposalStatus as proposalStatus",
        "proposal.proposalVotesId as  proposalVotesId",
        "proposal.proposalCreatedAt as proposalCreatedAt",
        "proposal.proposalUpdatedAt as proposalUpdatedAt",
        "proposal.proposalDeadline as proposalDeadline",
        "proposal.proposalSnapshot as proposalSnapshot",
        "proposal.calldatas as calldatas",
        "proposal.actionName as actionName",
        "proposal.encodeData as encodeData",
        "proposal.values as proposalValues",
        "proposal.addressArr as addressArr",
        "proposal.valueArr as valueArr",
        "proposal.encodeArr as encodeArr",
        "proposal.data as data",
        "proposal.status as status",
        "proposal.imageUrl as imageUrl",
        "proposal.metaData as metaData",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "vote.name as voteName",
        "user.wallet as userWallet",
        "user.accountId as userAccountId",
        "user.avatarUrl as userAvatarUrl",
        "user.username as userUsername",
        "vote.description as voteDescription",
        "COUNT(voteHistory.id) as totalVotes",
        "COUNT(CASE WHEN voteOption.name = 'For' THEN voteHistory.id ELSE NULL END) as totalFor",
        "COUNT(CASE WHEN voteOption.name = 'Against' THEN voteHistory.id ELSE NULL END) as totalAgainst",
        "COUNT(CASE WHEN voteOption.name = 'Abstain' THEN voteHistory.id ELSE NULL END) as totalAbstain"
      ])
      .groupBy("proposal.id")
      .orderBy("proposal.id", "DESC");

    if (Parameters.daoId) {
      queryBuilder.andWhere("proposal.daoId = :daoId", {
        daoId: Parameters.daoId,
      });
    }

    if (Parameters.proposalTitle) {
      queryBuilder.andWhere("proposal.proposalTitle = :proposalTitle", {
        proposalTitle: Parameters.proposalTitle,
      });
    }

    if (Parameters.proposalDescription) {
      queryBuilder.andWhere(
        "proposal.proposalDescription = :proposalDescription",
        {
          proposalDescription: Parameters.proposalDescription,
        }
      );
    }

    if (Parameters.proposalStatus) {
      queryBuilder.andWhere("proposal.proposalStatus = :proposalStatus", {
        proposalStatus: Parameters.proposalStatus,
      });
    }

    if (Parameters.proposalVotesId) {
      queryBuilder.andWhere("proposal.proposalVotesId = :proposalVotesId", {
        proposalVotesId: Parameters.proposalVotesId,
      });
    }


    if(Parameters.status && Parameters.status == 0){
      queryBuilder.andWhere("proposal.status = 0");
    }else if( Parameters.status == 1){
      queryBuilder.andWhere("proposal.status = 1");
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async voteProposalValue(
    createVoteProposalDto: createVoteProposalRequestDto,
    request: any
  ) {
    const voteHistory = new VoteHistory();
    voteHistory.proposalId = createVoteProposalDto.proposalId;
    voteHistory.voteAddress = createVoteProposalDto.voteAddress;
    voteHistory.voterId = createVoteProposalDto.voteId;
    voteHistory.voteOptionId = createVoteProposalDto.voteOptionId;
    voteHistory.voteComment = createVoteProposalDto.voteComment;
    voteHistory.votePower = createVoteProposalDto.votePower;

    return await this.voteHistoryRepository.save(voteHistory);
  }

  async getVoteValueProposal(id: number) {
    const voteData = await this.voteHistoryRepository
      .createQueryBuilder("voteHistory")
      .select([
        "voteHistory.id as id",
        "voteHistory.proposalId as proposalId",
        "voteHistory.voterId as voterId",
        "voteHistory.voteAddress as voteAddress",
        "voteHistory.voteOptionId as voteOptionId",
        "voteHistory.status as status",
        "voteHistory.createdAt as createdAt",
        "voteHistory.updatedAt as updatedAt",
        "voteHistory.voteComment as voteComment",
        "voteHistory.votePower as votePower"
      ])
      .where("voteHistory.id = :id", { id: id })
      .execute();

    return voteData;

  }
  async listVoteValueProposal(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<VoteOption>> {
    const queryBuilder = this.voteHistoryRepository
      .createQueryBuilder("voteHistory")
      .leftJoinAndSelect(
        Proposal,
        "proposal",
        "proposal.id = voteHistory.proposalId"
      )
      .leftJoinAndSelect(
        User,
        "user",
        "user.wallet=voteHistory.voteAddress"
      )
      .leftJoinAndSelect(
        Vote,
        "vote",
        "vote.id = voteHistory.voterId"
      )
      .leftJoinAndSelect(
        VoteOption,
        "voteOption",
        "voteOption.id = voteHistory.voteOptionId"
      )
      .select([
        "voteHistory.id as id",
        "voteHistory.proposalId as proposalId",
        "voteHistory.voterId as voterId",
        "voteHistory.voteAddress as voteAddress",
        "voteHistory.voteOptionId as voteOptionId",
        "voteHistory.status as status",
        "voteHistory.createdAt as createdAt",
        "voteHistory.updatedAt as updatedAt",
        "voteHistory.voteComment as voteComment",
        "voteHistory.votePower as votePower",
        "proposal.proposalTitle as proposalTitle",
        "proposal.proposalDescription as proposalDescription",
        "proposal.proposalId as proposalId",
        "proposal.proposalSnapshot as proposalSnapshot",
        "proposal.proposalDeadline as proposalDeadline",
        "proposal.proposalStatus as proposalStatus",
        "proposal.calldatas as calldatas",
        "proposal.actionName as actionName",
        "proposal.encodeData as encodeData",
        "proposal.imageUrl as imageUrl",
        "proposal.metaData as metaData",
        "proposal.values as proposalValues",
        "proposal.addressArr as addressArr",
        "proposal.valueArr as valueArr",
        "proposal.encodeArr as encodeArr",
        "proposal.data as data",
        "vote.name as voteName",
        "vote.description as voteDescription",
        "voteOption.name as voteOptionName",
        "voteOption.description as voteOptionDescription",
        "voteOption.enumSC as enumSC",
        "user.wallet as userWallet",
        "user.username as userUsername",
        "user.avatarUrl as userAvatarUrl",
        "user.firstName as userFirstName",
        "user.lastName as userLastName",
        "user.accountId as userAccountId"
      ])
      .orderBy("voteHistory.id", "DESC");

    if(Parameters.proposalId){
      queryBuilder.andWhere("proposal.id = :proposalId", {
        proposalId: Parameters.proposalId,
      });
    }

    if(Parameters.voterId){
      queryBuilder.andWhere("vote.id = :voterId", {
        voterId: Parameters.voterId,
      });
    }

    if(Parameters.voteOptionId){
      queryBuilder.andWhere("voteOption.id = :voteOptionId", {
        voteOptionId: Parameters.voteOptionId,
      });
    }

    if(Parameters.voteAddress){
      queryBuilder.andWhere("voteHistory.id = :voteAddress", {
        voteAddress: Parameters.voteAddress,
      });
    }

    if(Parameters.enumSC == 0){
      queryBuilder.andWhere("voteOption.enumSC = 0 ");
    }else if(Parameters.enumSC == 1){
      queryBuilder.andWhere("voteOption.enumSC = 1 ");
    }else if(Parameters.enumSC == 2){
        queryBuilder.andWhere("voteOption.enumSC = 2 ");
    }


    if(Parameters.status && Parameters.status == 0){
      queryBuilder.andWhere("voteHistory.status = 0");
    }else if( Parameters.status == 1){
      queryBuilder.andWhere("voteHistory.status = 1");
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async listCommentValueProposal(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<VoteOption>> {
    const queryBuilder = this.voteHistoryRepository
      .createQueryBuilder("voteHistory")
      .leftJoinAndSelect(
        Proposal,
        "proposal",
        "proposal.id = voteHistory.proposalId"
    )
      .leftJoinAndSelect(
        User,
        "user",
        "user.wallet=voteHistory.voteAddress"
      )
      .leftJoinAndSelect(
        Vote,
        "vote",
        "vote.id = voteHistory.voterId"
      )
      .leftJoinAndSelect(
        VoteOption,
        "voteOption",
        "voteOption.id = voteHistory.voteOptionId"
      )
      .select([
        "voteHistory.id as id",
        "voteHistory.proposalId as proposalId",
        "voteHistory.voterId as voterId",
        "voteHistory.voteAddress as voteAddress",
        "voteHistory.voteOptionId as voteOptionId",
        "voteHistory.status as status",
        "voteHistory.createdAt as createdAt",
        "voteHistory.updatedAt as updatedAt",
        "voteHistory.voteComment as voteComment",
        "voteHistory.votePower as votePower",
        "user.wallet as userWallet",
        "user.accountId as userAccountId",
        "user.avatarUrl as userAvatarUrl",
        "user.username as userUsername",
        "proposal.proposalTitle as proposalTitle",
        "proposal.proposalDescription as proposalDescription",
        "proposal.proposalId as proposalId",
        "proposal.proposalSnapshot as proposalSnapshot",
        "proposal.proposalDeadline as proposalDeadline",
        "proposal.proposalStatus as proposalStatus",
        "proposal.calldatas as calldatas",
        "proposal.actionName as actionName",
        "proposal.encodeData as encodeData",
        "proposal.imageUrl as imageUrl",
        "proposal.metaData as metaData",
        "proposal.values as proposalValues",
        "proposal.addressArr as addressArr",
        "proposal.valueArr as valueArr",
        "proposal.encodeArr as encodeArr",
        "proposal.data as data",
        "vote.name as voteName",
        "vote.description as voteDescription",
        "voteOption.name as voteOptionName",
        "voteOption.description as voteOptionDescription",
        "voteOption.enumSC as enumSC"
      ])
      .where("voteHistory.voteComment IS NOT NULL")
      .orderBy("voteHistory.id", "DESC");

    if(Parameters.proposalId){
      queryBuilder.andWhere("proposal.id = :proposalId", {
        proposalId: Parameters.proposalId,
      });
    }

    if(Parameters.voterId){
      queryBuilder.andWhere("vote.id = :voterId", {
        voterId: Parameters.voterId,
      });
    }

    if(Parameters.voteOptionId){
      queryBuilder.andWhere("voteOption.id = :voteOptionId", {
        voteOptionId: Parameters.voteOptionId,
      });
    }

    if(Parameters.voteAddress){
      queryBuilder.andWhere("voteHistory.id = :voteAddress", {
        voteAddress: Parameters.voteAddress,
      });
    }

    if(Parameters.enumSC == 0){
      queryBuilder.andWhere("voteOption.enumSC = 0 ");
    }else if(Parameters.enumSC == 1){
      queryBuilder.andWhere("voteOption.enumSC = 1 ");
    }else if(Parameters.enumSC == 2){
        queryBuilder.andWhere("voteOption.enumSC = 2 ");
    }


    if(Parameters.status && Parameters.status == 0){
      queryBuilder.andWhere("voteHistory.status = 0");
    }else if( Parameters.status == 1){
      queryBuilder.andWhere("voteHistory.status = 1");
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async allVoteProposal(Parameters: any): Promise<any> {
    const queryBuilder = this.voteHistoryRepository
      .createQueryBuilder("voteHistory")
      .leftJoinAndSelect(
        Proposal,
        "proposal",
        "proposal.id = voteHistory.proposalId"
      )
      .leftJoinAndSelect(
        Vote,
        "vote",
        "vote.id = voteHistory.voterId"
      )
      .leftJoinAndSelect(
        VoteOption,
        "voteOption",
        "voteOption.id = voteHistory.voteOptionId"
    )
      .leftJoin(User, "user","user.wallet= voteHistory.voteAddress")
      .select([
        "voteHistory.id as id",
        "voteHistory.proposalId as proposalId",
        "voteHistory.voterId as voterId",
        "voteHistory.voteAddress as voteAddress",
        "voteHistory.voteOptionId as voteOptionId",
        "voteHistory.status as status",
        "voteHistory.voteComment as voteComment",
        "voteHistory.votePower as votePower",
        "voteHistory.createdAt as createdAt",
        "voteHistory.updatedAt as updatedAt",
        "vote.name as voteName",
        "vote.description as voteDescription",
        "voteOption.name as voteOptionName",
        "voteOption.description as voteOptionDescription",
        "voteOption.enumSC as enumSC",
        "user.wallet as userWallet",
        "user.username as userUsername",
        "user.avatarUrl as userAvatarUrl",
        "user.firstName as userFirstName",
        "user.lastName as userLastName",
      ])
      .orderBy("voteHistory.id", "DESC");

    if(Parameters.proposalId){
      queryBuilder.andWhere("proposal.id = :proposalId", {
        proposalId: Parameters.proposalId,
      });
    }

    if (Parameters.limit) {
      queryBuilder.limit(Parameters.limit)
    }
    const results = await queryBuilder.execute();

    const totalVotes = await queryBuilder.getCount()
    const totalFor = await queryBuilder.andWhere("voteOption.name = :optionName", { optionName: 'For' }).getCount()
    const totalAbstain = await queryBuilder.andWhere("voteOption.name = :optionName", { optionName: 'Abstain' }).getCount()
    const totalAgainst = await queryBuilder.andWhere("voteOption.name = :optionName", { optionName: 'Against' }).getCount()


    return {
      results,
      pagination: {
        totalVotes,
        totalFor,
        totalAbstain,
        totalAgainst
      }
    }
  }

  async upload(file): Promise<any> {
    const { originalname } = file;
    const bucketS3 = process.env.AWS_BUCKET;
    return await this.uploadS3(file.buffer, bucketS3, originalname);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    let date = new Date().getTime();

    const params = {
      Bucket: bucket,
      Key: "proposal/" + String(date) + String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log("S3 eror: ", err);
          reject(err.message);
        }
        return resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async checkUserVote(proposalId: number, user: User) {
      const userVote = await this.userRepository.findOne({
          where: { id: user.id }
      });
      if (!userVote) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const proposal = await this.proposalRepository.findOne({
          where: { id: proposalId }
      });
      if (!proposal) {
          throw new HttpException('Proposal not found', HttpStatus.NOT_FOUND);
      }

      const voteHistory = await this.voteHistoryRepository.findOne({
          where: {
              proposalId: proposalId,
              voteAddress: userVote.wallet
          }
       });
      if (voteHistory) {
          return true;
      }

      return false;
  }
}
