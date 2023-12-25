import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Governors,
  User,
  DAO,
  DAOMember,
  Proposal,
  GovernorsSetting,
  TokenTransfer,
  VoteHistory,
  DAOSocial,
  DAODelegate,
  DAOProfile,
  GovernorsVoteField,
  GovernorsVoteValue,
  TypeTreasury,
  DAOTreasury,
  LatestBlock,
  TreasuryTransaction,
} from "../../database/entities";
import { Repository } from "typeorm";
import {
  SocialDto,
  createDaoRequestDto,
  createProfileDto,
  delegateDao,
  exploreDao,
  updateTypeTreasuryDto,
  createTypeTreasuryDto,
  updateTreasuryDto,
  createTreasuryDto,
} from "./request/daoRequest.dto";
import { async } from "rxjs";
import { PaginationResponse } from "src/config/rest/paginationResponse";
import {
  callQueryHederaSmc,
  getArrayPaginationBuildTotal,
  getLastestBlock,
  getOffset,
  getPaginationBuildTotal,
} from "src/shared/Utils";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { S3 } from "aws-sdk";
import { ApiCauses } from "src/config/exception/apiCauses";
import { StandardGovernor__factory } from "src/smart-contract/types";
import { BigNumber } from "ethers";

@Injectable()
export class DaoService {
  constructor(
    @InjectRepository(Governors)
    private readonly governorsRepository: Repository<Governors>,

    @InjectRepository(DAO)
    private readonly daoRepository: Repository<DAO>,

    @InjectRepository(DAODelegate)
    private readonly delegateRepository: Repository<DAODelegate>,

    @InjectRepository(DAOProfile)
    private readonly profileRepository: Repository<DAOProfile>,

    @InjectRepository(DAOMember)
    private readonly daoMemberRepository: Repository<DAOMember>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(DAOSocial)
    private readonly daoSocialRepository: Repository<DAOSocial>,

    @InjectRepository(TokenTransfer)
    private readonly tokenTransferRepository: Repository<TokenTransfer>,

    @InjectRepository(TypeTreasury)
    private readonly typeTreasuryRepository: Repository<TypeTreasury>,

    @InjectRepository(DAOTreasury)
    private readonly daoTreasuryRepository: Repository<DAOTreasury>,

    @InjectRepository(LatestBlock)
    private readonly latestBlockRepository: Repository<LatestBlock>,

    @InjectRepository(TreasuryTransaction)
    private readonly treasuryTransactionRepository: Repository<TreasuryTransaction>
  ) {}

  async createDao(data: createDaoRequestDto, user: User, file: any) {
    let dao = new DAO();
    dao.daoName = data.daoName;
    dao.daoDescription = data.daoDescription;
    dao.governorId = data.governorId;

    if (file) {
      const upload = await this.upload(file);
      if (!upload || !upload.Location) return false;
      dao.daoLogo = upload.Location;
    }

    dao = await this.daoRepository.save(dao);

    if (data.social) {
      const listSocial: SocialDto[] = JSON.parse(data.social);
      for (const item of listSocial) {
        let social = new DAOSocial();
        social.daoId = dao.id;
        if (item.description) social.description = item.description;
        if (item.name) social.name = item.name;
        if (item.origin) social.origin = item.origin;
        if (item.type) social.type = item.type;
        if (item.url) social.url = item.url;
        if (item.username) social.username = item.username;
        this.daoSocialRepository.save(social);
      }
    }

    let userData = await this.userRepository.findOne({
      where: { id: Number(user.id) },
    });

    let daoMember = new DAOMember();
    daoMember.daoId = dao.id;
    daoMember.memberAddress = userData.wallet;
    daoMember.memberName = userData.username;
    daoMember.roleId = 1;

    daoMember = await this.daoMemberRepository.save(daoMember);
    return dao;
  }

  async createSocial(id: string, data: SocialDto) {
    let dao = await this.daoRepository.findOne({ where: { id: Number(id) } });
    if (dao) {
      let social = new DAOSocial();
      social.daoId = Number(id);
      if (data.description) social.description = data.description;
      if (data.name) social.name = data.name;
      if (data.origin) social.origin = data.origin;
      if (data.type) social.type = data.type;
      if (data.url) social.url = data.url;
      if (data.username) social.username = data.username;
      return await this.daoSocialRepository.save(social);
    }
    return null;
  }

  async updateSocial(id: string, data: SocialDto) {
    let social = await this.daoSocialRepository.findOne({
      where: { id: Number(id) },
    });
    if (!social) return null;

    if (data.description) social.description = data.description;
    if (data.name) social.name = data.name;
    if (data.origin) social.origin = data.origin;
    if (data.type) social.type = data.type;
    if (data.url) social.url = data.url;
    if (data.username) social.username = data.username;
    social = await this.daoSocialRepository.save(social);
    return social;
  }

  async deleteSocial(id: string) {
    return await this.daoSocialRepository.delete(+id);
  }

  async getListSocial(id: number) {
    const queryBuilder = this.daoSocialRepository
      .createQueryBuilder("daoSocial")
      .select([
        "daoSocial.id as id",
        "daoSocial.name as name",
        "daoSocial.type as type",
        "daoSocial.description as description",
        "daoSocial.origin as origin",
        "daoSocial.username as username",
        "daoSocial.url as url",
      ])
      .where("daoSocial.daoId = :daoId", {
        daoId: id,
      });

    const data = await queryBuilder.execute();

    return {
      results: data,
    };
  }

  async exploreDao(exploreDaoRequestDto: exploreDao, user: User) {
    let userData = await this.userRepository.findOne({
      where: { id: Number(user.id) },
    });

    let daoMember = new DAOMember();
    daoMember.daoId = exploreDaoRequestDto.daoId;
    daoMember.memberAddress = userData.wallet;
    daoMember.memberName = userData.username;
    daoMember.roleId = 2;

    daoMember = await this.daoMemberRepository.save(daoMember);
    return daoMember;
  }

  async getDaoById(id: string) {
    let dao = await this.daoRepository
      .createQueryBuilder("dao")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governorSetting.id = governor.setting_id"
      )
      .leftJoinAndSelect(DAOMember, "daoMember", "daoMember.daoId = dao.id")
      .leftJoinAndSelect(User, "user", "user.wallet = daoMember.memberAddress")
      .select([
        "dao.id as id",
        "dao.daoName as daoName",
        "dao.daoLogo as daoLogo",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "dao.created_at as createdAt",
        "dao.updated_at as updatedAt",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.predictTreasury as predictTreasury",
        "governorSetting.setting_name as governorSettingName",
        "user.username as userUsername",
        "user.wallet as userWallet",
        "user.accountId as userAccountId",
        "user.avatarUrl as userAvatarUrl",
        "user.firstName as userFirstName",
        "user.lastName as userLastName",
        "user.status as userStatus",
        "(SELECT JSON_ARRAYAGG(JSON_OBJECT('type', u.type, 'name', u.name, 'username', u.username,'url' ,u.url, 'description',u.description,'origin',u.origin)) FROM (SELECT type, name, username, url, description, origin FROM dao_social WHERE dao_id=dao.id ) u) as socials",
      ])
      .where("daoMember.role_id = 1")
      .andWhere("dao.id = :id", { id: Number(id) })
      .getRawOne();
    return dao;
  }

  async updateDao(id: string, data: createDaoRequestDto, user: User) {
    let dao = await this.daoRepository.findOne({ where: { id: Number(id) } });
    dao.daoName = data.daoName;
    dao.daoDescription = data.daoDescription;
    dao.governorId = data.governorId;
    dao = await this.daoRepository.save(dao);
    return dao;
  }

  async deleteDao(id: string, user: User) {
    let dao = await this.daoRepository.findOne({ where: { id: Number(id) } });
    dao = await this.daoRepository.remove(dao);
    return dao;
  }

  async getListDao(Parameters: any, paginationOptions: IPaginationOptions) {
    const queryBuilder = await this.daoRepository
      .createQueryBuilder("dao")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(Proposal, "proposal", "dao.id = proposal.daoId")
      .leftJoinAndSelect(
        VoteHistory,
        "voteHistory",
        "voteHistory.proposalId = proposal.id"
      )
      .leftJoinAndSelect(DAOMember, "daoMember", "daoMember.daoId = dao.id")
      .select([
        "dao.id as id",
        "dao.daoName as daoName",
        "dao.daoLogo as daoLogo",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "dao.created_at as createdAt",
        "dao.updated_at as updatedAt",
        "governor.name as governorName",
        "governorSetting.settingName as governorSettingName",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "COUNT(DISTINCT voteHistory.id) as totalVotes",
        "IFNULL(SUM(voteHistory.votePower), '0') as totalVotePower",
        "COUNT(DISTINCT proposal.id) as totalProposals",
        "COUNT(DISTINCT voteHistory.voteAddress) as totalVoters",
        "COUNT(DISTINCT daoMember.memberAddress) as totalHolders",
        "(SELECT JSON_ARRAYAGG(JSON_OBJECT('valueArr', u.valueArr,'addressArr' ,u.addressArr, 'encodeArr',u.encodeArr,'proposalTitle',u.proposalTitle)) FROM (SELECT value_arr as valueArr, address_arr as addressArr, encode_arr as encodeArr, proposal_title as proposalTitle FROM proposal WHERE dao_id=dao.id ) u) as proposalLists",
      ])
      .groupBy("dao.id")
      .orderBy("dao.created_at", "DESC");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName like :daoName", {
        daoName: `%${Parameters.daoName}%`,
      });
    }

    if (Parameters.governorId) {
      queryBuilder.andWhere("dao.governorId = :governorId", {
        governorId: Parameters.governorId,
      });
    }
    if (Parameters.status && Parameters.status == 0) {
      queryBuilder.andWhere("governor.status = 0");
    } else if (Parameters.status == 1) {
      queryBuilder.andWhere("governor.status = 1");
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

  async getMyListDao(Parameters: any, paginationOptions: IPaginationOptions) {
    let userData = await this.userRepository.findOne({
      where: { id: Number(Parameters.userId) },
    });

    const queryBuilder = await this.daoRepository
      .createQueryBuilder("dao")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(Proposal, "proposal", "dao.id = proposal.daoId")
      .leftJoinAndSelect(
        VoteHistory,
        "voteHistory",
        "voteHistory.proposalId = proposal.id"
      )
      .leftJoinAndSelect(DAOMember, "daoMember", "daoMember.daoId = dao.id")
      .select([
        "dao.id as id",
        "dao.daoName as daoName",
        "dao.daoLogo as daoLogo",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "dao.created_at as createdAt",
        "dao.updated_at as updatedAt",
        "governor.name as governorName",
        "governorSetting.settingName as governorSettingName",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "COUNT(DISTINCT voteHistory.id) as totalVotes",
        "IFNULL(SUM(voteHistory.votePower), '0') as totalVotePower",
        "COUNT(DISTINCT proposal.id) as totalProposals",
        "COUNT(DISTINCT voteHistory.voteAddress) as totalVoters",
        "COUNT(DISTINCT daoMember.memberAddress) as totalHolders",
        "(SELECT JSON_ARRAYAGG(JSON_OBJECT('valueArr', u.valueArr,'addressArr' ,u.addressArr, 'encodeArr',u.encodeArr,'proposalTitle',u.proposalTitle)) FROM (SELECT value_arr as valueArr, address_arr as addressArr, encode_arr as encodeArr, proposal_title as proposalTitle FROM proposal WHERE dao_id=dao.id ) u) as proposalLists",
      ])
      .groupBy("dao.id")
      .orderBy("dao.created_at", "DESC");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName = :daoName", {
        daoName: Parameters.daoName,
      });
    }

    if (Parameters.governorId) {
      queryBuilder.andWhere("dao.governorId = :governorId", {
        governorId: Parameters.governorId,
      });
    }

    console.log(userData.wallet);

    if (userData.wallet) {
      queryBuilder.andWhere(
        "dao.id in (select dao_id from dao_member where member_address = :memberAddress and role_id = 1)",
        {
          memberAddress: userData.wallet,
        }
      );
    }

    if (Parameters.status && Parameters.status == 0) {
      queryBuilder.andWhere("governor.status = 0");
    } else if (Parameters.status == 1) {
      queryBuilder.andWhere("governor.status = 1");
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

  async getMyListDaoMember(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    let userData = await this.userRepository.findOne({
      where: { id: Number(Parameters.userId) },
    });

    const queryBuilder = await this.daoRepository
      .createQueryBuilder("dao")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(Proposal, "proposal", "dao.id = proposal.daoId")
      .leftJoinAndSelect(
        VoteHistory,
        "voteHistory",
        "voteHistory.proposalId = proposal.id"
      )
      .leftJoinAndSelect(DAOMember, "daoMember", "daoMember.daoId = dao.id")
      .select([
        "dao.id as id",
        "dao.daoName as daoName",
        "dao.daoLogo as daoLogo",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "dao.created_at as createdAt",
        "dao.updated_at as updatedAt",
        "governor.name as governorName",
        "governorSetting.settingName as governorSettingName",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "COUNT(DISTINCT voteHistory.id) as totalVotes",
        "IFNULL(SUM(voteHistory.votePower), '0') as totalVotePower",
        "COUNT(DISTINCT proposal.id) as totalProposals",
        "COUNT(DISTINCT voteHistory.voteAddress) as totalVoters",
        "COUNT(DISTINCT daoMember.memberAddress) as totalHolders",
        "(SELECT JSON_ARRAYAGG(JSON_OBJECT('valueArr', u.valueArr,'addressArr' ,u.addressArr, 'encodeArr',u.encodeArr,'proposalTitle',u.proposalTitle)) FROM (SELECT value_arr as valueArr, address_arr as addressArr, encode_arr as encodeArr, proposal_title as proposalTitle FROM proposal WHERE dao_id=dao.id ) u) as proposalLists",
      ])
      .groupBy("dao.id")
      .addOrderBy("dao.id", "DESC");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName = :daoName", {
        daoName: Parameters.daoName,
      });
    }

    if (Parameters.governorId) {
      queryBuilder.andWhere("dao.governorId = :governorId", {
        governorId: Parameters.governorId,
      });
    }

    console.log(userData.wallet);

    if (userData.wallet) {
      queryBuilder.andWhere(
        "dao.id in (select dao_id from dao_member where member_address = :memberAddress and role_id = 2 AND dao_id NOT IN (SELECT dao_id FROM dao_member WHERE member_address = :memberAddress and role_id = 1 ))",
        {
          memberAddress: userData.wallet,
        }
      );
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

  async getListDaoMembership(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.daoRepository
      .createQueryBuilder("dao")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(DAOMember, "daoMember", "daoMember.daoId = dao.id")
      .leftJoinAndSelect(User, "user", "user.wallet = daoMember.memberAddress")
      .select([
        "dao.id as id",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "dao.created_at as createdAt",
        "dao.updated_at as updatedAt",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governorSetting.settingName as governorSettingName",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "daoMember.memberAddress as memberAddress",
        "daoMember.memberName as memberName",
        "daoMember.id as daoMemberId",
        "user.username as memberUsername",
        "user.accountId as memberAccountId",
        "user.avatarUrl as memberAvatarUrl",
        "user.firstName as memberFirstName",
        "user.lastName as memberLastName",
        "user.status as memberStatus",
      ])
      .where("daoMember.role_id = 2")
      .andWhere("dao.id = :id", {
        id: Parameters.id,
      })
      .groupBy("daoMember.memberAddress")
      .addOrderBy("daoMember.id", "DESC");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName = :daoName", {
        daoName: Parameters.daoName,
      });
    }

    if (Parameters.governorId) {
      queryBuilder.andWhere("dao.governorId = :governorId", {
        governorId: Parameters.governorId,
      });
    }

    if (Parameters.status && Parameters.status == 0) {
      queryBuilder.andWhere("governor.status = 0");
    } else if (Parameters.status == 1) {
      queryBuilder.andWhere("governor.status = 1");
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

  async getListExploreDao(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.daoRepository
      .createQueryBuilder("dao")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(Proposal, "proposal", "proposal.daoId = dao.id")
      .select([
        "dao.id as id",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "dao.created_at as createdAt",
        "dao.updated_at as updatedAt",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.predictTreasury as predictTreasury",
        "count(proposal.id) as proposals",
        "0 as holders",
        "0 as voters",
      ])
      .groupBy("dao.id");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName = :daoName", {
        daoName: Parameters.daoName,
      });
    }

    if (Parameters.governorId) {
      queryBuilder.andWhere("dao.governorId = :governorId", {
        governorId: Parameters.governorId,
      });
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

  async getListTransactionTokenByDao(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.tokenTransferRepository
      .createQueryBuilder("tokenTransfer")
      .leftJoinAndSelect(DAO, "dao", "dao.id = tokenTransfer.tokenId")
      .leftJoin(User, "user", "user.wallet = tokenTransfer.fromAddress")
      .leftJoin(User, "user_to", "user_to.wallet = tokenTransfer.toAddress")

      .select([
        "tokenTransfer.id as id",
        "tokenTransfer.fromAddress as fromAddress",
        "tokenTransfer.toAddress as toAddress",
        "tokenTransfer.amount as amount",
        "user.username as usernameFrom",
        "user_to.username as usernameTo",
      ])
      .where("tokenTransfer.tokenId = :id", {
        id: Parameters.id,
      })
      .addOrderBy("tokenTransfer.id", "DESC");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName = :daoName", {
        daoName: Parameters.daoName,
      });
    }

    if (Parameters.governorId) {
      queryBuilder.andWhere("dao.governorId = :governorId", {
        governorId: Parameters.governorId,
      });
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

  async delegateDao(data: delegateDao, user: User) {
    let userData = await this.userRepository.findOne({
      where: { id: Number(user.id) },
    });

    let dao = new DAODelegate();
    dao.daoId = data.daoId;
    dao.balance = data.balance;
    dao.fromAddress = userData.wallet;
    dao.toAddress = data.toAddress;

    dao = await this.delegateRepository.save(dao);
    return dao;
  }

  async getListDelegateByDao(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.delegateRepository
      .createQueryBuilder("daoDelegate")
      .leftJoin(DAO, "dao", "dao.id = daoDelegate.daoId")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(
        User,
        "fromUser",
        "fromUser.wallet = daoDelegate.fromAddress"
      )
      .leftJoinAndSelect(
        User,
        "toUser",
        "toUser.wallet = daoDelegate.toAddress"
      )
      .select([
        "daoDelegate.id as id",
        "dao.id as daoId",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "daoDelegate.balance as balance",
        "daoDelegate.created_at as createdAt",
        "daoDelegate.updated_at as updatedAt",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governorSetting.settingName as governorSettingName",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "fromUser.username as fromUsername",
        "fromUser.accountId as fromAccountId",
        "fromUser.avatarUrl as fromAvatarUrl",
        "fromUser.firstName as fromFirstName",
        "fromUser.lastName as fromLastName",
        "fromUser.wallet as fromWallet",
        "toUser.username as toUsername",
        "toUser.accountId as toAccountId",
        "toUser.avatarUrl as toAvatarUrl",
        "toUser.firstName as toFirstName",
        "toUser.lastName as toLastName",
        "daoDelegate.toAddress as toWallet",
      ])
      .andWhere("daoDelegate.daoId = :id", {
        id: Parameters.id,
      })
      .addOrderBy("daoDelegate.id", "DESC");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName = :daoName", {
        daoName: Parameters.daoName,
      });
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

  async getListReceivedDelegate(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    let userData = await this.userRepository.findOne({
      where: { id: Number(Parameters.userId) },
    });

    const queryBuilder = await this.delegateRepository
      .createQueryBuilder("daoDelegate")
      .leftJoin(DAO, "dao", "dao.id = daoDelegate.daoId")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(
        User,
        "fromUser",
        "fromUser.wallet = daoDelegate.fromAddress"
      )
      .leftJoinAndSelect(
        User,
        "toUser",
        "toUser.wallet = daoDelegate.toAddress"
      )
      .select([
        "daoDelegate.id as id",
        "dao.id as daoId",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "daoDelegate.balance as balance",
        "daoDelegate.created_at as createdAt",
        "daoDelegate.updated_at as updatedAt",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governorSetting.settingName as governorSettingName",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "fromUser.username as fromUsername",
        "fromUser.accountId as fromAccountId",
        "fromUser.avatarUrl as fromAvatarUrl",
        "fromUser.firstName as fromFirstName",
        "fromUser.lastName as fromLastName",
        "fromUser.wallet as fromWallet",
        "toUser.username as toUsername",
        "toUser.accountId as toAccountId",
        "toUser.avatarUrl as toAvatarUrl",
        "toUser.firstName as toFirstName",
        "toUser.lastName as toLastName",
        "daoDelegate.toAddress as toWallet",
      ])
      .where("toUser.wallet = :wallet", {
        wallet: userData.wallet,
      })
      .addOrderBy("daoDelegate.id", "DESC");

    if (Parameters.daoName) {
      queryBuilder.andWhere("dao.daoName = :daoName", {
        daoName: Parameters.daoName,
      });
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

  async getTopDelegate(Parameters: any, paginationOptions: IPaginationOptions) {
    const queryBuilder = this.delegateRepository
      .createQueryBuilder("daoDelegate")
      .leftJoinAndSelect(DAO, "dao", "dao.id = daoDelegate.daoId")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(
        User,
        "fromUser",
        "fromUser.wallet = daoDelegate.fromAddress"
      )
      .leftJoinAndSelect(
        User,
        "toUser",
        "toUser.wallet = daoDelegate.toAddress"
      )
      .leftJoinAndSelect(
        DAOProfile,
        "daoProfile",
        "daoProfile.userAddress = daoDelegate.toAddress AND daoProfile.daoId = dao.id"
      )
      .select([
        "dao.id as daoId",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governorSetting.settingName as governorSettingName",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "COUNT(DISTINCT fromUser.wallet) as totalUserDelegate",
        "COUNT(DISTINCT daoDelegate.id) as totalDelegate",
        "toUser.username as username",
        "toUser.accountId as accountId",
        "toUser.avatarUrl as avatarUrl",
        "toUser.firstName as firstName",
        "toUser.lastName as lastName",
        "MAX(daoProfile.bio) as bio",
        "MAX(daoProfile.statement) as fullStatement",
        "daoDelegate.toAddress as wallet",
        "(SELECT JSON_ARRAYAGG(JSON_OBJECT('wallet', u.from_address,'accountId' ,u.accountId,'username',u.username,'avatarUrl',u.avatarUrl)) FROM (SELECT from_address , user.account_id as accountId, user.avatar_url as avatarUrl, user.username as username,MAX(dao_delegate.created_at) AS maxCreatedAt FROM dao_delegate LEFT JOIN user user on user.wallet = from_address WHERE to_address = daoDelegate.toAddress AND dao_id=dao.id GROUP BY from_address  ORDER BY maxCreatedAt DESC LIMIT 3) u) as latestFromUsers",
      ])
      .where("daoDelegate.daoId = :id", {
        id: Parameters.id,
      })
      .groupBy("daoDelegate.toAddress");

    // if (Parameters.orderBalance) {
    //   queryBuilder.addOrderBy("CAST(totalBalance AS FLOAT)", "DESC");
    // }

    if (Parameters.search) {
      queryBuilder.andWhere("LOWER(daoDelegate.toAddress) LIKE :address", {
        address: `%${Parameters.search.toLowerCase()}%`,
      });
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();
    const latestBlock = await getLastestBlock();
    for(let i = 0; i < data.length; i++) {
      const resLastBlock = await getLastestBlock();
      const standardGovernor = new StandardGovernor__factory();
      const dataEncode = standardGovernor.interface.encodeFunctionData(
        "getVotes",
        [data[i].wallet, latestBlock[0].number - 1]
      );
      const { result } = await callQueryHederaSmc({
        block: "latest",
        data: dataEncode,
        estimate: false,
        from: "0x000000000000000000000000000000000046d649",
        gas: 100000,
        gasPrice: 10000,
        to: data[i].governorAddress as string,
        value: 0,
      });
      data[i].totalBalance = BigNumber.from(result).toString()
      console.log(BigNumber.from(result).toString())
    }
    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async createProfile(data: createProfileDto, user: User) {
    let userData = await this.userRepository.findOne({
      where: { id: Number(user.id) },
    });

    let dao = new DAOProfile();
    dao.daoId = data.daoId;
    dao.bio = data.bio;
    dao.statement = data.fullStatement;
    dao.userAddress = userData.wallet;

    dao = await this.profileRepository.save(dao);
    return dao;
  }

  async getProfile(params: any, user: User) {
    let data = await this.profileRepository
      .createQueryBuilder("daoProfile")
      .leftJoinAndSelect(DAO, "dao", "dao.id = daoProfile.daoId")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .select([
        "dao.id as daoId",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.status as status",
        "governor.predictTreasury as predictTreasury",
        "daoProfile.bio as bio",
        "daoProfile.statement as fullStatement",
      ])
      .where("daoProfile.daoId = :id", {
        id: params.id,
      })
      .andWhere("daoProfile.userAddress = :address", {
        address: params.address,
      })
      .getRawOne();
    return data;
  }

  async checkDelegate(params: any, user: User) {
    let userData = await this.userRepository.findOne({
      where: { id: Number(user.id) },
    });
    let data = await this.delegateRepository
      .createQueryBuilder("delegateDao")
      .leftJoinAndSelect(DAO, "dao", "dao.id = delegateDao.daoId")
      .leftJoinAndSelect(Governors, "governor", "governor.id = dao.governorId")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governor.settingId = governorSetting.id"
      )
      .leftJoinAndSelect(
        GovernorsVoteField,
        "governorVoteField",
        "governor.settingId = governorVoteField.settingId AND governorVoteField.fieldName = 'symbol'"
      )
      .leftJoinAndSelect(
        GovernorsVoteValue,
        "governorVoteValue",
        "governor.id = governorVoteValue.governorId AND governorVoteValue.fieldId = governorVoteField.id"
      )
      .leftJoinAndSelect(
        User,
        "toUser",
        "toUser.wallet = delegateDao.toAddress"
      )
      .select([
        "CASE WHEN delegateDao.fromAddress = delegateDao.toAddress THEN '1' ELSE '2' END as status",
        "toUser.username as username",
        "toUser.accountId as accountId",
        "toUser.avatarUrl as avatarUrl",
        "toUser.firstName as firstName",
        "toUser.lastName as lastName",
        "dao.id as daoId",
        "dao.daoName as daoName",
        "dao.daoDescription as daoDescription",
        "dao.governorId as governorId",
        "dao.daoLogo as daoLogo",
        "delegateDao.toAddress as address",
        "delegateDao.balance as balance",
        "governor.name as governorName",
        "governor.address as governorAddress",
        "governor.timelockDeterministic as timelockDeterministic",
        "governor.timelockMinDelay as timelockMinDelay",
        "governor.voteToken as voteToken",
        "governor.predictTreasury as predictTreasury",
        "governorSetting.settingName as governorSettingName",
        "governorVoteValue.fieldValue as symbolToken",
      ])
      .where("dao.id = :id", {
        id: params.id,
      })
      .andWhere("delegateDao.fromAddress = :address", {
        address: userData.wallet,
      })
      .orderBy("delegateDao.createdAt", "DESC")
      .getRawOne();

    if (!data) {
      data = await this.daoRepository
        .createQueryBuilder("dao")
        .leftJoinAndSelect(
          Governors,
          "governor",
          "governor.id = dao.governorId"
        )
        .leftJoinAndSelect(
          GovernorsSetting,
          "governorSetting",
          "governor.settingId = governorSetting.id"
        )
        .leftJoinAndSelect(
          GovernorsVoteField,
          "governorVoteField",
          "governor.settingId = governorVoteField.settingId AND governorVoteField.fieldName = 'symbol'"
        )
        .leftJoinAndSelect(
          GovernorsVoteValue,
          "governorVoteValue",
          "governor.id = governorVoteValue.governorId AND governorVoteValue.fieldId = governorVoteField.id"
        )
        .select([
          "'0' as status",
          "dao.id as daoId",
          "dao.daoName as daoName",
          "dao.daoDescription as daoDescription",
          "dao.governorId as governorId",
          "dao.daoLogo as daoLogo",
          "governor.name as governorName",
          "governor.address as governorAddress",
          "governor.timelockDeterministic as timelockDeterministic",
          "governor.timelockMinDelay as timelockMinDelay",
          "governor.voteToken as voteToken",
          "governor.predictTreasury as predictTreasury",
          "governorSetting.settingName as governorSettingName",
          "governorVoteValue.fieldValue as symbolToken",
        ])
        .where("dao.id = :id", {
          id: params.id,
        })
        .getRawOne();
    }
    return data;
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
      Key: "dao/" + String(date) + String(name),
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

  async createTypeTreasury(data: createTypeTreasuryDto) {
    let typeTreasury = new TypeTreasury();
    typeTreasury.typeName = data.typeName;
    typeTreasury = await this.typeTreasuryRepository.save(typeTreasury);
    return typeTreasury;
  }

  async updateTypeTreasury(data: updateTypeTreasuryDto) {
    let typeTreasury = await this.typeTreasuryRepository.findOne({
      where: { id: Number(data.id) },
    });
    typeTreasury.typeName = data.typeName;
    typeTreasury = await this.typeTreasuryRepository.save(typeTreasury);
    return typeTreasury;
  }

  async getTypeTreasury(id: string) {
    let typeTreasury = await this.typeTreasuryRepository.findOne({
      where: { id: Number(id) },
    });
    return typeTreasury;
  }

  async deleteTypeTreasury(id: string) {
    let typeTreasury = await this.typeTreasuryRepository.findOne({
      where: { id: Number(id) },
    });
    return await this.typeTreasuryRepository.remove(typeTreasury);
  }

  async getListTypeTreasury(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.typeTreasuryRepository
      .createQueryBuilder("typeTreasury")
      .select(["typeTreasury.id as id", "typeTreasury.typeName as typeName"])
      .orderBy("typeTreasury.id", "DESC");

    if (Parameters.typeName) {
      queryBuilder.andWhere("typeTreasury.typeName = :typeName", {
        typeName: Parameters.typeName,
      });
    }

    if (Parameters.id) {
      queryBuilder.andWhere("typeTreasury.id = :id", {
        id: Parameters.id,
      });
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const typeTreasury = await queryBuilder
      .offset(offset)
      .limit(limit)
      .execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: typeTreasury,
      pagination: pagination.meta,
    };
  }

  async createTreasury(data: createTreasuryDto) {
    let daoTreasury = new DAOTreasury();
    daoTreasury.daoId = data.daoId;
    daoTreasury.token = data.token;
    daoTreasury.tokenName = data.tokenName;
    daoTreasury.typeId = data.typeId;
    daoTreasury.tokenId = data.tokenId;

    let latestBlockTreasury = await this.latestBlockRepository.findOne({
      where: { currency: `Treasury_${data.daoId}_${data.token}` },
    });

    if (!latestBlockTreasury) {
      latestBlockTreasury = new LatestBlock();
      latestBlockTreasury.currency = `Treasury_${data.daoId}_${data.token}`;
      latestBlockTreasury.blockNumber = (
        new Date().getTime() / 1000
      ).toString();
      latestBlockTreasury = await this.latestBlockRepository.save(
        latestBlockTreasury
      );
    } else {
      throw ApiCauses.TREASURY_EXIST;
    }

    daoTreasury = await this.daoTreasuryRepository.save(daoTreasury);

    return daoTreasury;
  }

  async updateTreasury(data: updateTreasuryDto) {
    let daoTreasury = await this.daoTreasuryRepository.findOne({
      where: { id: Number(data.id) },
    });
    daoTreasury.token = data.token;
    daoTreasury.tokenName = data.tokenName;
    daoTreasury.typeId = data.typeId;
    daoTreasury.tokenId = data.tokenId;

    daoTreasury = await this.daoTreasuryRepository.save(daoTreasury);
    return daoTreasury;
  }

  async getTreasury(id: string) {
    let daoTreasury = await this.daoTreasuryRepository.findOne({
      where: { id: Number(id) },
    });
    return daoTreasury;
  }

  async deleteTreasury(id: string) {
    let daoTreasury = await this.daoTreasuryRepository.findOne({
      where: { id: Number(id) },
    });
    return await this.daoTreasuryRepository.remove(daoTreasury);
  }

  async getListTreasury(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.daoTreasuryRepository
      .createQueryBuilder("daoTreasury")
      .leftJoinAndSelect(DAO, "dao", "dao.id = daoTreasury.daoId")
      .leftJoinAndSelect(
        TypeTreasury,
        "typeTreasury",
        "typeTreasury.id = daoTreasury.typeId"
      )
      .select([
        "daoTreasury.id as id",
        "daoTreasury.daoId as daoId",
        "daoTreasury.token as token",
        "daoTreasury.tokenName as tokenName",
        "daoTreasury.typeId as typeId",
        "daoTreasury.tokenId as tokenId",
        "dao.daoName as daoName",
        "typeTreasury.typeName as typeName",
      ])
      .orderBy("daoTreasury.id", "DESC");

    if (Parameters.id) {
      queryBuilder.andWhere("daoTreasury.id = :id", {
        id: Parameters.id,
      });
    }

    if (Parameters.daoId) {
      queryBuilder.andWhere("daoTreasury.daoId = :daoId", {
        daoId: Parameters.daoId,
      });
    }

    if (Parameters.tokenName) {
      queryBuilder.andWhere("daoTreasury.tokenName = :tokenName", {
        tokenName: Parameters.tokenName,
      });
    }

    if (Parameters.typeId) {
      queryBuilder.andWhere("daoTreasury.typeId = :typeId", {
        typeId: Parameters.typeId,
      });
    }

    if (Parameters.token) {
      queryBuilder.andWhere("daoTreasury.token = :token", {
        token: Parameters.token,
      });
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const daoTreasury = await queryBuilder
      .offset(offset)
      .limit(limit)
      .execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: daoTreasury,
      pagination: pagination.meta,
    };
  }

  async getListTreasuryWithdraw(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.treasuryTransactionRepository

      .createQueryBuilder("treasuryTransaction")
      .leftJoinAndSelect(DAOTreasury, "daoTreasury", "daoTreasury.token = treasuryTransaction.predict_treasury")
      .leftJoinAndSelect(
        TypeTreasury,
        "typeTreasury",
        "typeTreasury.id = daoTreasury.typeId"
      )
      .select([
        "treasuryTransaction.id as id",
        "treasuryTransaction.from_address as fromAddress",
        "treasuryTransaction.to_address as toAddress",
        "treasuryTransaction.predict_treasury as predictTreasury",
        "treasuryTransaction.amount as amount",
        "treasuryTransaction.created_at as createdAt",
        "treasuryTransaction.updated_at as updatedAt",
        "daoTreasury.tokenName as tokenName",
        "typeTreasury.typeName as typeName",
      ])
      .orderBy("treasuryTransaction.id", "DESC");

    if (Parameters.token) {
      queryBuilder.andWhere("treasuryTransaction.from_address = :token", {
        token: Parameters.token,
      });
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const treasuryTransaction = await queryBuilder
      .offset(offset)
      .limit(limit)
      .execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: treasuryTransaction,
      pagination: pagination.meta,
    };
  }

  async getListTreasuryDeposit(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.treasuryTransactionRepository

      .createQueryBuilder("treasuryTransaction")
      .leftJoinAndSelect(DAOTreasury, "daoTreasury", "daoTreasury.token = treasuryTransaction.predict_treasury")
      .leftJoinAndSelect(
        TypeTreasury,
        "typeTreasury",
        "typeTreasury.id = daoTreasury.typeId"
      )
      .select([
        "treasuryTransaction.id as id",
        "treasuryTransaction.from_address as fromAddress",
        "treasuryTransaction.to_address as toAddress",
        "treasuryTransaction.predict_treasury as predictTreasury",
        "treasuryTransaction.amount as amount",
        "treasuryTransaction.created_at as createdAt",
        "treasuryTransaction.updated_at as updatedAt",
        "daoTreasury.tokenName as tokenName",
        "typeTreasury.typeName as typeName",

      ])
      .orderBy("treasuryTransaction.id", "DESC");

    if (Parameters.token) {
      queryBuilder.andWhere("treasuryTransaction.to_address = :token", {
        token: Parameters.token,
      });
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const treasuryTransaction = await queryBuilder
      .offset(offset)
      .limit(limit)
      .execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: treasuryTransaction,
      pagination: pagination.meta,
    };
  }

  async getListTreasuryTransactions(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ) {
    const queryBuilder = await this.treasuryTransactionRepository
      .createQueryBuilder("treasuryTransaction")
      .leftJoinAndSelect(DAOTreasury, "daoTreasury", "daoTreasury.token = treasuryTransaction.predict_treasury and treasuryTransaction.token_id = daoTreasury.dao_id")
      .leftJoinAndSelect(
        TypeTreasury,
        "typeTreasury",
        "typeTreasury.id = daoTreasury.typeId"
      )
      .select([
        "treasuryTransaction.id as id",
        "treasuryTransaction.from_address as fromAddress",
        "treasuryTransaction.to_address as toAddress",
        "treasuryTransaction.predict_treasury as predictTreasury",
        "treasuryTransaction.amount as amount",
        "treasuryTransaction.created_at as createdAt",
        "treasuryTransaction.updated_at as updatedAt",
        "daoTreasury.tokenName as tokenName",
        "typeTreasury.typeName as typeName",
        "CASE WHEN treasuryTransaction.from_address = treasuryTransaction.predict_treasury THEN 'withdraw' ELSE 'deposit' END as type",
      ])
      .orderBy("treasuryTransaction.id", "DESC");
    if(!Parameters.type && Parameters.token){
      queryBuilder.andWhere("(treasuryTransaction.from_address = :token or treasuryTransaction.to_address = :token)", {
        token: Parameters.token,
      });
    }

    if (Parameters.type == 1 && Parameters.token) {
      queryBuilder.andWhere("treasuryTransaction.from_address = :token", {
        token: Parameters.token,
      });
    }

    if (Parameters.type == 2 && Parameters.token) {
      queryBuilder.andWhere("treasuryTransaction.to_address = :token", {
        token: Parameters.token,
      });
    }

    const total = await queryBuilder.getCount();

    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const treasuryTransaction = await queryBuilder
      .offset(offset)
      .limit(limit)
      .execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: treasuryTransaction,
      pagination: pagination.meta,
    };
  }
}
