import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Governors,
  User,
  GovernorsSetting,
  GovernorsType,
  GovernorsSettingField,
  GovernorsSettingValue,
  GovernorsVoteField,
  GovernorsVoteValue,
  LatestBlock
} from "../../database/entities";
import { Repository } from "typeorm";
import {
  createGovernorsRequestDto,
  createGovernorsTypeRequestDto,
  createGovernorsSettingRequestDto,
  createGovernorsSettingFieldRequestDto,
  createGovernorsSettingValueRequestDto,
  createGovernorsVoteFieldRequestDto,
  createGovernorsVoteValueRequestDto,
} from "./request/governorsRequest.dto";
import { PaginationResponse } from "src/config/rest/paginationResponse";
import {
  getArrayPaginationBuildTotal,
  getOffset,
  getPaginationBuildTotal,
} from "src/shared/Utils";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
const axios = require("axios");

import { async } from "rxjs";

@Injectable()
export class GovernorsService {
  constructor(
    @InjectRepository(Governors)
    private readonly governorsRepository: Repository<Governors>,

    @InjectRepository(GovernorsType)
    private readonly governorsTypeRepository: Repository<GovernorsType>,

    @InjectRepository(GovernorsSetting)
    private readonly governorsSettingRepository: Repository<GovernorsSetting>,

    @InjectRepository(GovernorsSettingField)
    private readonly governorsSettingFieldRepository: Repository<GovernorsSettingField>,

    @InjectRepository(GovernorsSettingValue)
    private readonly governorsSettingValueRepository: Repository<GovernorsSettingValue>,

    @InjectRepository(GovernorsVoteField)
    private readonly governorsVoteFieldRepository: Repository<GovernorsVoteField>,

    @InjectRepository(GovernorsVoteValue)
    private readonly governorsVoteValueRepository: Repository<GovernorsVoteValue>,

    @InjectRepository(LatestBlock)
    private readonly latestBlockRepository: Repository<LatestBlock>,

  ) {}

  async createGovernors(data: createGovernorsRequestDto, user: User) {
    let governor = await this.governorsRepository.findOne({
      where: {
        address : data.address,
        voteToken : data.voteToken,
        timelockDeterministic: data.timelockDeterministic
       },
    });

    const url = `
    https://testnet.mirrornode.hedera.com/api/v1/accounts/${data.address}
    `;

    let jsonResponse = null ;
    try {
      const response = await axios.get(url);
      jsonResponse = response.data;
      console.log(jsonResponse);
    } catch (err) {
      console.log("error", err);
    }
    if(governor){
      governor = await this.governorsRepository.remove(governor);
    }

    let governors = new Governors();
    governors.name = data.name;
    governors.address = data.address;
    governors.role = data.role;
    governors.typeId = data.typeId;
    governors.settingId = data.settingId;
    governors.timelockDeterministic = data.timelockDeterministic;
    governors.voteToken = data.voteToken;
    governors.timelockMinDelay = data.timelockMinDelay;
    governors.contractId = (jsonResponse && jsonResponse.account ) ? jsonResponse.account : "";
    governors.blockNumber = Math.floor(new Date().getTime()/1000.0);
    governors.predictTreasury = data.predictTreasury;


    let latestBlock = await this.latestBlockRepository.findOne({
      where: { currency: `Membership_${data.voteToken}` },
    });

    if(!latestBlock){
      latestBlock = new LatestBlock();
      latestBlock.currency = `Membership_${data.voteToken}`;
      latestBlock.blockNumber = (new Date().getTime() / 1000).toString();
      latestBlock = await this.latestBlockRepository.save(latestBlock);
    }


    governors = await this.governorsRepository.save(governors);
    return governors;
  }

  async getGovernorsById(id: string) {
    let governors = await this.governorsRepository.findOne({
      where: { id: Number(id) },
    });
    return governors;
  }
1
  async updateGovernors(
    id: string,
    data: createGovernorsRequestDto,
    user: User
  ) {
    let governors = await this.governorsRepository.findOne({
      where: { id: Number(id) },
    });
    governors.name = data.name;
    governors.address = data.address;
    governors.timelockDeterministic = data.timelockDeterministic;
    governors.voteToken = data.voteToken;
    governors.role = data.role;
    governors.typeId = data.typeId;
    governors.settingId = data.settingId;
    governors.timelockMinDelay = data.timelockMinDelay;
    governors.contractId = data.contractId;
    governors.predictTreasury = data.predictTreasury;
    governors = await this.governorsRepository.save(governors);

    let latestBlock = await this.latestBlockRepository.findOne({
      where: { currency: `Membership_${data.voteToken}` },
    });

    if(!latestBlock){
      latestBlock = new LatestBlock();
      latestBlock.currency = `Membership_${data.voteToken}`;
      latestBlock.blockNumber = (new Date().getTime() / 1000 - 1000).toString();
      latestBlock = await this.latestBlockRepository.save(latestBlock);
    }


    return governors;
  }

  async deleteGovernors(id: string, user: User) {
    let governors = await this.governorsRepository.findOne({
      where: { id: Number(id) },
    });
    governors = await this.governorsRepository.remove(governors);
    return governors;
  }

  async getListGovernors(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<Governors>> {
    const queryBuilder = await this.governorsRepository

      .createQueryBuilder("governors")
      .leftJoinAndSelect(
        GovernorsType,
        "governorType",
        "governorType.id = governors.typeId"
      )
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governorSetting.id = governors.settingId"
      )

      .select([
        "governors.id as id",
        "governors.name as name",
        "governors.address as address",
        "governors.role as role",
        "governors.createdAt as createdAt",
        "governors.updatedAt as updatedAt",
        "governors.timelockDeterministic as timelockDeterministic",
        "governors.voteToken as voteToken",
        "governors.timelockMinDelay as timelockMinDelay",
        "governors.predictTreasury as predictTreasury",
        "governors.status as status",
        "governorType.typeName as typeName",
        "governorSetting.settingName as settingName",

      ])
      .addOrderBy("governors.id", "DESC");

    if (Parameters.name) {
      queryBuilder.andWhere("governors.name = :name", {
        name: Parameters.name,
      });
    }

    if (Parameters.address) {
      queryBuilder.andWhere("governors.address = :address", {
        address: Parameters.address,
      });
    }

    if (Parameters.role) {
      queryBuilder.andWhere("governors.role = :role", {
        role: Parameters.role,
      });
    }

    if(Parameters.status == 0){
      queryBuilder.andWhere("governors.status = 0");
    }else if( Parameters.status == 1){
      queryBuilder.andWhere("governors.status = 1");
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

  async createGovernorsType(data: createGovernorsTypeRequestDto, user: User) {
    let governorsType = new GovernorsType();
    governorsType.typeName = data.typeName;
    governorsType.typeDescription = data.typeDescription;
    governorsType.typeStatus = data.typeStatus;
    governorsType = await this.governorsTypeRepository.save(governorsType);
    return governorsType;
  }

  async getGovernorsTypeById(id: string) {
    let governorsType = await this.governorsTypeRepository.findOne({
      where: { id: Number(id) },
    });
    console.log(governorsType);
    return governorsType;
  }

  async updateGovernorsType(
    id: string,
    data: createGovernorsTypeRequestDto,
    user: User
  ) {
    let governorsType = await this.governorsTypeRepository.findOne({
      where: { id: Number(id) },
    });
    governorsType.typeName = data.typeName;
    governorsType.typeDescription = data.typeDescription;
    governorsType = await this.governorsTypeRepository.save(governorsType);
    return governorsType;
  }

  async deleteGovernorsType(id: string, user: User) {
    let governorsType = await this.governorsTypeRepository.findOne({
      where: { id: Number(id) },
    });
    governorsType = await this.governorsTypeRepository.remove(governorsType);
    return governorsType;
  }

  async getListGovernorsType(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<GovernorsType>> {
    const queryBuilder = await this.governorsTypeRepository
      .createQueryBuilder("governorsType")
      .select([
        "governorsType.id as id",
        "governorsType.typeName as typeName",
        "governorsType.typeDescription as typeDescription",
        "governorsType.typeStatus as typeStatus",
        "governorsType.createdAt as createdAt",
        "governorsType.updatedAt as updatedAt",
      ])
      .addOrderBy("governorsType.id", "DESC");
    if (Parameters.typeName) {
      queryBuilder.andWhere("governorsType.typeName = :typeName", {
        typeName: Parameters.typeName,
      });
    }
    if (Parameters.typeDescription) {
      queryBuilder.andWhere(
        "governorsType.typeDescription = :typeDescription",
        { typeDescription: Parameters.typeDescription }
      );
    }
    if (Parameters.typeStatus) {
      queryBuilder.andWhere("governorsType.typeStatus = :typeStatus", {
        typeStatus: Parameters.typeStatus,
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

  async createGovernorsSetting(
    data: createGovernorsSettingRequestDto,
    user: User
  ) {
    let governorsSetting = new GovernorsSetting();
    governorsSetting.settingName = data.settingName;
    governorsSetting.settingDescription = data.settingDescription;
    governorsSetting.typeId = data.typeId;
    governorsSetting = await this.governorsSettingRepository.save(
      governorsSetting
    );
    return governorsSetting;
  }

  async getGovernorsSettingById(id: string) {
    let governorsSetting = await this.governorsSettingRepository.findOne({
      where: { id: Number(id) },
    });
    console.log(governorsSetting);
    return governorsSetting;
  }

  async updateGovernorsSetting(
    id: string,
    data: createGovernorsSettingRequestDto,
    user: User
  ) {
    let governorsSetting = await this.governorsSettingRepository.findOne({
      where: { id: Number(id) },
    });
    governorsSetting.settingName = data.settingName;
    governorsSetting.settingDescription = data.settingDescription;
    governorsSetting.typeId = data.typeId;
    governorsSetting = await this.governorsSettingRepository.save(
      governorsSetting
    );
    return governorsSetting;
  }

  async deleteGovernorsSetting(id: string, user: User) {
    let governorsSetting = await this.governorsSettingRepository.findOne({
      where: { id: Number(id) },
    });
    governorsSetting = await this.governorsSettingRepository.remove(
      governorsSetting
    );
    return governorsSetting;
  }

  async getListGovernorsSetting(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<GovernorsSetting>> {
    const queryBuilder = this.governorsSettingRepository
      .createQueryBuilder("governorsSetting")
      .leftJoinAndSelect(
        GovernorsType,
        "governorType",
        "governorType.id = governorsSetting.typeId"
      )
      .select([
        "governorsSetting.id as id",
        "governorsSetting.settingName as settingName",
        "governorsSetting.settingDescription as settingDescription",
        "governorsSetting.typeId as typeId",
        "governorsSetting.createdAt as createdAt",
        "governorsSetting.updatedAt as updatedAt",
        "governorType.typeName as typeName",
      ])
      .addOrderBy("governorsSetting.id", "DESC");

    if (Parameters.settingName) {
      queryBuilder.andWhere("governorsSetting.settingName = :settingName", {
        settingName: Parameters.settingName,
      });
    }

    if (Parameters.settingDescription) {
      queryBuilder.andWhere(
        "governorsSetting.settingDescription = :settingDescription",
        { settingDescription: Parameters.settingDescription }
      );
    }

    if (Parameters.typeId) {
      queryBuilder.andWhere("governorsSetting.typeId = :typeId", {
        typeId: Parameters.typeId,
      });
    }

    const total = await queryBuilder.getCount();
    console.log(total);
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).orderBy("num_of_order", "ASC").execute();
    console.log(data);

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async createGovernorsSettingField(
    data: createGovernorsSettingFieldRequestDto,
    user: User
  ) {
    let governorsSettingField = new GovernorsSettingField();
    governorsSettingField.fieldValue = data.fieldValue;
    governorsSettingField.fieldDescription = data.fieldDescription;
    governorsSettingField.fieldName = data.fieldName;
    governorsSettingField.settingId = data.settingId;
    governorsSettingField.fieldPlaceholder = data.fieldPlaceholder;
    governorsSettingField = await this.governorsSettingFieldRepository.save(
      governorsSettingField
    );
    return governorsSettingField;
  }

  async getGovernorsSettingFieldById(id: string) {
    let governorsSettingField =
      await this.governorsSettingFieldRepository.findOne({
        where: { id: Number(id) },
      });
    console.log(governorsSettingField);
    return governorsSettingField;
  }

  async updateGovernorsSettingField(
    id: string,
    data: createGovernorsSettingFieldRequestDto,
    user: User
  ) {
    let governorsSettingField =
      await this.governorsSettingFieldRepository.findOne({
        where: { id: Number(id) },
      });
    governorsSettingField.fieldValue = data.fieldValue;
    governorsSettingField.fieldDescription = data.fieldDescription;
    governorsSettingField.fieldName = data.fieldName;
    governorsSettingField.settingId = data.settingId;
    governorsSettingField.fieldPlaceholder = data.fieldPlaceholder;
    governorsSettingField = await this.governorsSettingFieldRepository.save(
      governorsSettingField
    );
    return governorsSettingField;
  }

  async deleteGovernorsSettingField(id: string, user: User) {
    let governorsSettingField =
      await this.governorsSettingFieldRepository.findOne({
        where: { id: Number(id) },
      });
    governorsSettingField = await this.governorsSettingFieldRepository.remove(
      governorsSettingField
    );
    return governorsSettingField;
  }

  async getListGovernorsSettingField(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<GovernorsSettingField>> {
    const queryBuilder = this.governorsSettingFieldRepository
      .createQueryBuilder("governorsSettingField")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governorSetting.id = governorsSettingField.settingId"
      )
      .select([
        "governorsSettingField.id as id",
        "governorsSettingField.fieldValue as fieldValue",
        "governorsSettingField.fieldName as fieldName",
        "governorsSettingField.fieldDescription as fieldDescription",
        "governorsSettingField.fieldPlaceholder as fieldPlaceholder",
        "governorsSettingField.settingId as settingId",
        "governorsSettingField.createdAt as createdAt",
        "governorsSettingField.updatedAt as updatedAt",
        "governorSetting.settingName as settingName",
      ])
      .addOrderBy("governorsSettingField.id", "DESC");

    if (Parameters.fieldName) {
      queryBuilder.andWhere("governorsSettingField.fieldName = :fieldName", {
        fieldName: Parameters.fieldName,
      });
    }

    if (Parameters.fieldValue) {
      queryBuilder.andWhere("governorsSettingField.fieldValue = :fieldValue", {
        fieldValue: Parameters.fieldValue,
      });
    }

    if (Parameters.fieldDescription) {
      queryBuilder.andWhere(
        "governorsSettingField.fieldDescription = :fieldDescription",
        { fieldDescription: Parameters.fieldDescription }
      );
    }

    if (Parameters.settingId) {
      queryBuilder.andWhere("governorsSettingField.settingId = :settingId", {
        settingId: Parameters.settingId,
      });
    }

    const total = await queryBuilder.getCount();
    console.log(total);
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).orderBy("governorsSettingField.num_of_order", "ASC").execute();

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async createGovernorsSettingValue(
    data: createGovernorsSettingValueRequestDto,
    user: User
  ) {
    let governorsSettingValue = new GovernorsSettingValue();
    governorsSettingValue.fieldValue = data.fieldValue;
    governorsSettingValue.fieldId = data.fieldId;
    governorsSettingValue.governorId = data.governorId;
    governorsSettingValue = await this.governorsSettingValueRepository.save(
      governorsSettingValue
    );
    return governorsSettingValue;
  }

  async getGovernorsSettingValueById(id: string) {
    let governorsSettingValue =
      await this.governorsSettingValueRepository.findOne({
        where: { id: Number(id) },
      });
    console.log(governorsSettingValue);
    return governorsSettingValue;
  }

  async updateGovernorsSettingValue(
    id: string,
    data: createGovernorsSettingValueRequestDto,
    user: User
  ) {
    let governorsSettingValue =
      await this.governorsSettingValueRepository.findOne({
        where: { id: Number(id) },
      });
    governorsSettingValue.fieldValue = data.fieldValue;
    governorsSettingValue.fieldId = data.fieldId;
    governorsSettingValue.governorId = data.governorId;
    governorsSettingValue = await this.governorsSettingValueRepository.save(
      governorsSettingValue
    );
    return governorsSettingValue;
  }

  async deleteGovernorsSettingValue(id: string, user: User) {
    let governorsSettingValue =
      await this.governorsSettingValueRepository.findOne({
        where: { id: Number(id) },
      });
    governorsSettingValue = await this.governorsSettingValueRepository.remove(
      governorsSettingValue
    );
    return governorsSettingValue;
  }

  async getListGovernorsSettingValue(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<GovernorsSettingValue>> {
    const queryBuilder = this.governorsSettingValueRepository
      .createQueryBuilder("governorsSettingValue")
      .leftJoinAndSelect(
        GovernorsSettingField,
        "governorSettingField",
        "governorSettingField.id = governorsSettingValue.fieldId"
      )
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governorSetting.id = governorSettingField.settingId"
      )
      .leftJoinAndSelect(
        Governors,
        "governor",
        "governor.id = governorsSettingValue.governorId"
      )
      .select([
        "governorsSettingValue.id as id",
        "governorsSettingValue.fieldValue as fieldValue",
        "governorsSettingValue.fieldId as fieldId",
        "governorsSettingValue.createdAt as createdAt",
        "governorsSettingValue.updatedAt as updatedAt",
        "governorSettingField.fieldName as fieldName",
        "governorSettingField.fieldValue as settingValue",
        "governorSettingField.fieldDescription as fieldDescription",
        "governorSettingField.fieldPlaceholder as fieldPlaceholder",
        "governorSettingField.settingId as settingId",
        "governorSetting.settingName as settingName",
        "governor.name as governorName",
      ])
      .addOrderBy("governorsSettingValue.id", "DESC");

    if (Parameters.fieldName) {
      queryBuilder.andWhere("governorsSettingValue.fieldName = :fieldName", {
        fieldName: Parameters.fieldName,
      });
    }

    if (Parameters.fieldValue) {
      queryBuilder.andWhere("governorsSettingValue.fieldValue = :fieldValue", {
        fieldValue: Parameters.fieldValue,
      });
    }

    if (Parameters.fieldId) {
      queryBuilder.andWhere("governorsSettingValue.fieldId = :fieldId", {
        fieldId: Parameters.fieldId,
      });
    }
    if(Parameters.settingId){
      queryBuilder.andWhere("governorsSettingField.settingId = :settingId", {
        settingId: Parameters.settingId,
      });
    }

    if(Parameters.governorId){
      queryBuilder.andWhere("governorsSettingValue.governorId = :governorId", {
        governorId: Parameters.governorId,
      });
    }

    const total = await queryBuilder.getCount();
    console.log(total);
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();
    console.log(data);

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async createGovernorsVoteField(
    data: createGovernorsVoteFieldRequestDto,
    user: User
  ) {
    let governorsVoteField = new GovernorsVoteField();
    governorsVoteField.fieldValue = data.fieldValue;
    governorsVoteField.fieldDescription = data.fieldDescription;
    governorsVoteField.fieldName = data.fieldName;
    governorsVoteField.settingId = data.settingId;
    governorsVoteField = await this.governorsVoteFieldRepository.save(
      governorsVoteField
    );
    return governorsVoteField;
  }

  async getGovernorsVoteFieldById(id: string) {
    let governorsVoteField = await this.governorsVoteFieldRepository.findOne({
      where: { id: Number(id) },
    });
    console.log(governorsVoteField);
    return governorsVoteField;
  }

  async updateGovernorsVoteField(
    id: string,
    data: createGovernorsVoteFieldRequestDto,
    user: User
  ) {
    let governorsVoteField = await this.governorsVoteFieldRepository.findOne({
      where: { id: Number(id) },
    });
    governorsVoteField.fieldValue = data.fieldValue;
    governorsVoteField.fieldDescription = data.fieldDescription;
    governorsVoteField.fieldName = data.fieldName;
    governorsVoteField.settingId = data.settingId;
    governorsVoteField = await this.governorsVoteFieldRepository.save(
      governorsVoteField
    );
    return governorsVoteField;
  }

  async deleteGovernorsVoteField(id: string, user: User) {
    let governorsVoteField = await this.governorsVoteFieldRepository.findOne({
      where: { id: Number(id) },
    });
    governorsVoteField = await this.governorsVoteFieldRepository.remove(
      governorsVoteField
    );
    return governorsVoteField;
  }

  async getListGovernorsVoteField(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<GovernorsVoteField>> {
    const queryBuilder = this.governorsVoteFieldRepository
      .createQueryBuilder("governorsVoteField")
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governorSetting.id = governorsVoteField.settingId"
      )
      .select([
        "governorsVoteField.id as id",
        "governorsVoteField.fieldValue as fieldValue",
        "governorsVoteField.fieldName as fieldName",
        "governorsVoteField.fieldDescription as fieldDescription",
        "governorsVoteField.settingId as settingId",
        "governorsVoteField.createdAt as createdAt",
        "governorsVoteField.updatedAt as updatedAt",
        "governorSetting.settingName as settingName",
      ])
      .addOrderBy("governorsVoteField.id", "DESC");

    if (Parameters.fieldName) {
      queryBuilder.andWhere("governorsVoteField.fieldName = :fieldName", {
        fieldName: Parameters.fieldName,
      });
    }

    if (Parameters.fieldValue) {
      queryBuilder.andWhere("governorsVoteField.fieldValue = :fieldValue", {
        fieldValue: Parameters.fieldValue,
      });
    }

    if (Parameters.fieldDescription) {
      queryBuilder.andWhere(
        "governorsVoteField.fieldDescription = :fieldDescription",
        { fieldDescription: Parameters.fieldDescription }
      );
    }

    if (Parameters.settingId) {
      queryBuilder.andWhere("governorsVoteField.settingId = :settingId", {
        settingId: Parameters.settingId,
      });
    }

    const total = await queryBuilder.getCount();
    console.log(total);
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).orderBy("governorsVoteField.num_of_order", "ASC").execute();
    console.log(data);

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }

  async createGovernorsVoteValue(
    data: createGovernorsVoteValueRequestDto,
    user: User
  ) {
    let governorsVoteValue = new GovernorsVoteValue();
    governorsVoteValue.fieldValue = data.fieldValue;
    governorsVoteValue.fieldId = data.fieldId;
    governorsVoteValue.governorId = data.governorId;
    governorsVoteValue = await this.governorsVoteValueRepository.save(
      governorsVoteValue
    );
    return governorsVoteValue;
  }

  async getGovernorsVoteValueById(id: string) {
    let governorsVoteValue = await this.governorsVoteValueRepository.findOne({
      where: { id: Number(id) },
    });
    console.log(governorsVoteValue);
    return governorsVoteValue;
  }

  async updateGovernorsVoteValue(
    id: string,
    data: createGovernorsVoteValueRequestDto,
    user: User
  ) {
    let governorsVoteValue = await this.governorsVoteValueRepository.findOne({
      where: { id: Number(id) },
    });
    governorsVoteValue.fieldValue = data.fieldValue;
    governorsVoteValue.fieldId = data.fieldId;
    governorsVoteValue.governorId = data.governorId;
    governorsVoteValue = await this.governorsVoteValueRepository.save(
      governorsVoteValue
    );
    return governorsVoteValue;
  }

  async deleteGovernorsVoteValue(id: string, user: User) {
    let governorsVoteValue = await this.governorsVoteValueRepository.findOne({
      where: { id: Number(id) },
    });
    governorsVoteValue = await this.governorsVoteValueRepository.remove(
      governorsVoteValue
    );
    return governorsVoteValue;
  }

  async getListGovernorsVoteValue(
    Parameters: any,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<GovernorsVoteValue>> {
    const queryBuilder = this.governorsVoteValueRepository
      .createQueryBuilder("governorsVoteValue")
      .leftJoinAndSelect(
        GovernorsVoteField,
        "governorVoteField",
        "governorVoteField.id = governorsVoteValue.fieldId"
      )
      .leftJoinAndSelect(
        GovernorsSetting,
        "governorSetting",
        "governorSetting.id = governorVoteField.settingId"
      )
      .leftJoinAndSelect(
        Governors,
        "governor",
        "governor.id = governorsVoteValue.governorId"
      )
      .select([
        "governorsVoteValue.id as id",
        "governorsVoteValue.fieldValue as fieldValue",
        "governorsVoteValue.fieldId as fieldId",
        "governorsVoteValue.createdAt as createdAt",
        "governorsVoteValue.updatedAt as updatedAt",
        "governorVoteField.fieldName as fieldName",
        "governorVoteField.fieldDescription as fieldDescription",
        "governorVoteField.settingId as settingId",
        "governorSetting.settingName as settingName",
        "governor.name as governorName",
      ])
      .addOrderBy("governorsVoteValue.id", "DESC");

    if (Parameters.fieldName) {
      queryBuilder.andWhere("governorsVoteValue.fieldName = :fieldName", {
        fieldName: Parameters.fieldName,
      });
    }

    if (Parameters.fieldValue) {
      queryBuilder.andWhere("governorsVoteValue.fieldValue = :fieldValue", {
        fieldValue: Parameters.fieldValue,
      });
    }

    if (Parameters.fieldId) {
      queryBuilder.andWhere("governorsVoteValue.fieldId = :fieldId", {
        fieldId: Parameters.fieldId,
      });
    }
    if(Parameters.settingId){
      queryBuilder.andWhere("governorVoteField.settingId = :settingId", {
        settingId: Parameters.settingId,
      });
    }
    if(Parameters.governorId){
      queryBuilder.andWhere("governorsVoteValue.governorId = :governorId", {
        governorId: Parameters.governorId,
      });

    }

    const total = await queryBuilder.getCount();
    console.log(total);
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const data = await queryBuilder.offset(offset).limit(limit).execute();
    console.log(data);

    const pagination = getPaginationBuildTotal(total, paginationOptions);

    return {
      results: data,
      pagination: pagination.meta,
    };
  }
}
