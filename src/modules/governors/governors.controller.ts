import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Delete,
  DefaultValuePipe,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
  Param,
  UseInterceptors,
  UploadedFile,
  UsePipes,
} from "@nestjs/common";
import { PaginationResponse } from "src/config/rest/paginationResponse";

import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ApiCauses } from "src/config/exception/apiCauses";
import { GovernorsService } from "./governors.service";
import {
  createGovernorsRequestDto,
  createGovernorsTypeRequestDto,
  createGovernorsSettingRequestDto,
  createGovernorsSettingFieldRequestDto,
  createGovernorsSettingValueRequestDto,
  createGovernorsVoteFieldRequestDto,
  createGovernorsVoteValueRequestDto,
} from "./request/governorsRequest.dto";
import { JwtAuthGuard } from "../user/jwt-auth.guard";
import RequestWithUser from "../user/requestWithUser.interface";
import {
  Governors,
  GovernorsSetting,
  GovernorsSettingField,
  GovernorsSettingValue,
  GovernorsType,
  GovernorsVoteField,
  GovernorsVoteValue,
} from "src/database/entities";

@Controller("governors")
export class GovernorsController {
  constructor(private governorsService: GovernorsService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors",
    summary: "create governors",
    description: "create governors",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernors(
    @Body() createGovernorsRequestDto: createGovernorsRequestDto,
    @Req() request: RequestWithUser
  ) {
    let createGovernors = await this.governorsService.createGovernors(
      createGovernorsRequestDto,
      request.user
    );
    if (!createGovernors) throw ApiCauses.DATA_INVALID;
    return createGovernors;
  }

  @Get("item")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get governors by id",
    summary: "get governors by id",
    description: "get governors by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async getGovernorsById(@Query("id") id: string) {
    let governors = await this.governorsService.getGovernorsById(id);
    if (!governors) throw ApiCauses.DATA_INVALID;
    return governors;
  }

  @Put("update")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "update governors",
    summary: "update governors",
    description: "update governors",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async updateGovernors(
    @Query("id") id: string,
    @Body() createGovernorsRequestDto: createGovernorsRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateGovernors = await this.governorsService.updateGovernors(
      id,
      createGovernorsRequestDto,
      request.user
    );
    if (!updateGovernors) throw ApiCauses.DATA_INVALID;
    return updateGovernors;
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "delete governors",
    summary: "delete governors",
    description: "delete governors",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async deleteGovernors(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteGovernors = await this.governorsService.deleteGovernors(
      id,
      request.user
    );
    if (!deleteGovernors) throw ApiCauses.DATA_INVALID;
    return deleteGovernors;
  }

  @Get("list")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get list governors",
    summary: "get list governors",
    description: "get list governors",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "name",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "address",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "role",
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: Number,
  })
  async getListGovernors(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("name") name: string,
    @Query("address") address: string,
    @Query("role") role: string,
    @Query("status") status: number,
    @Req() request: any
  ): Promise<PaginationResponse<Governors>> {
    let listGovernors = await this.governorsService.getListGovernors(
      { name, address, role, status },
      { page, limit }
    );
    if (!listGovernors) throw ApiCauses.DATA_INVALID;
    return listGovernors;
  }

  @Post("type")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors type",
    summary: "create governors type",
    description: "create governors type",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsType(
    @Body() createGovernorsTypeRequestDto: createGovernorsTypeRequestDto,
    @Req() request: RequestWithUser
  ) {
    let createGovernorsType = await this.governorsService.createGovernorsType(
      createGovernorsTypeRequestDto,
      request.user
    );
    if (!createGovernorsType) throw ApiCauses.DATA_INVALID;
    return createGovernorsType;
  }

  @Get("item-type")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get governors type by id",
    summary: "get governors type by id",
    description: "get governors type by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async getGovernorsTypeById(@Query("id") id: string) {
    console.log(id);

    let governorsType = await this.governorsService.getGovernorsTypeById(id);
    if (!governorsType) throw ApiCauses.DATA_INVALID;
    return governorsType;
  }

  @Put("type")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "update governors type",
    summary: "update governors type",
    description: "update governors type",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateGovernorsType(
    @Query("id") id: string,
    @Body() createGovernorsTypeRequestDto: createGovernorsTypeRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateGovernorsType = await this.governorsService.updateGovernorsType(
      id,
      createGovernorsTypeRequestDto,
      request.user
    );
    if (!updateGovernorsType) throw ApiCauses.DATA_INVALID;
    return updateGovernorsType;
  }

  @Delete("type")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "delete governors type",
    summary: "delete governors type",
    description: "delete governors type",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async deleteGovernorsType(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteGovernorsType = await this.governorsService.deleteGovernorsType(
      id,
      request.user
    );
    if (!deleteGovernorsType) throw ApiCauses.DATA_INVALID;
    return deleteGovernorsType;
  }

  @Get("type")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get list governors type",
    summary: "get list governors type",
    description: "get list governors type",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "typeName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "typeDescription",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "typeStatuse",
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getListGovernorsType(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("typeName") typeName: string,
    @Query("typeDescription") typeDescription: string,
    @Query("typeStatuse") typeStatuse: string,
    @Req() request: any
  ): Promise<PaginationResponse<GovernorsType>> {
    let listGovernorsType = await this.governorsService.getListGovernorsType(
      { typeName, typeDescription, typeStatuse },
      { page, limit }
    );
    if (!listGovernorsType) throw ApiCauses.DATA_INVALID;
    return listGovernorsType;
  }

  @Post("setting")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors setting",
    summary: "create governors setting",
    description: "create governors setting",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsSetting(
    @Body() createGovernorsSettingRequestDto: createGovernorsSettingRequestDto,
    @Req() request: RequestWithUser
  ) {
    let createGovernorsSetting =
      await this.governorsService.createGovernorsSetting(
        createGovernorsSettingRequestDto,
        request.user
      );
    if (!createGovernorsSetting) throw ApiCauses.DATA_INVALID;
    return createGovernorsSetting;
  }

  @Get("item-setting")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get governors setting by id",
    summary: "get governors setting by id",
    description: "get governors setting by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getGovernorsSettingById(@Query("id") id: string) {
    let governorsSetting = await this.governorsService.getGovernorsSettingById(
      id
    );
    if (!governorsSetting) throw ApiCauses.DATA_INVALID;
    return governorsSetting;
  }

  @Put("setting")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "update governors setting",
    summary: "update governors setting",
    description: "update governors setting",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateGovernorsSetting(
    @Query("id") id: string,
    @Body() createGovernorsSettingRequestDto: createGovernorsSettingRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateGovernorsSetting =
      await this.governorsService.updateGovernorsSetting(
        id,
        createGovernorsSettingRequestDto,
        request.user
      );
    if (!updateGovernorsSetting) throw ApiCauses.DATA_INVALID;
    return updateGovernorsSetting;
  }

  @Delete("setting")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "delete governors setting",
    summary: "delete governors setting",
    description: "delete governors setting",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteGovernorsSetting(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteGovernorsSetting =
      await this.governorsService.deleteGovernorsSetting(id, request.user);
    if (!deleteGovernorsSetting) throw ApiCauses.DATA_INVALID;
    return deleteGovernorsSetting;
  }

  @Get("setting")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get list governors setting",
    summary: "get list governors setting",
    description: "get list governors setting",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "settingName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "settingDescription",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "typeId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "typeName",
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getListGovernorsSetting(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("settingName") settingName: string,
    @Query("settingDescription") settingDescription: string,
    @Query("typeId") typeId: number,
    @Query("typeName") typeName: string,
    @Req() request: any
  ): Promise<PaginationResponse<any>> {
    let listGovernorsSetting =
      await this.governorsService.getListGovernorsSetting(
        { settingName, settingDescription, typeId, typeName },
        { page, limit }
      );
    if (!listGovernorsSetting) throw ApiCauses.DATA_INVALID;
    return listGovernorsSetting;
  }

  @Post("field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors setting field",
    summary: "create governors setting field",
    description: "create governors setting field",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsSettingField(
    @Body()
    createGovernorsSettingFieldRequestDto: createGovernorsSettingFieldRequestDto,
    @Req() request: RequestWithUser
  ) {
    let createGovernorsSettingField =
      await this.governorsService.createGovernorsSettingField(
        createGovernorsSettingFieldRequestDto,
        request.user
      );
    if (!createGovernorsSettingField) throw ApiCauses.DATA_INVALID;
    return createGovernorsSettingField;
  }

  @Get("item-field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get governors setting field by id",
    summary: "get governors setting field by id",
    description: "get governors setting field by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async getGovernorsSettingFieldById(@Query("id") id: string) {
    let governorsSettingField =
      await this.governorsService.getGovernorsSettingFieldById(id);
    if (!governorsSettingField) throw ApiCauses.DATA_INVALID;
    return governorsSettingField;
  }

  @Put("field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "update governors setting field",
    summary: "update governors setting field",
    description: "update governors setting field",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateGovernorsSettingField(
    @Query("id") id: string,
    @Body()
    createGovernorsSettingFieldRequestDto: createGovernorsSettingFieldRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateGovernorsSettingField =
      await this.governorsService.updateGovernorsSettingField(
        id,
        createGovernorsSettingFieldRequestDto,
        request.user
      );
    if (!updateGovernorsSettingField) throw ApiCauses.DATA_INVALID;
    return updateGovernorsSettingField;
  }

  @Delete("field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "delete governors setting field",
    summary: "delete governors setting field",
    description: "delete governors setting field",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteGovernorsSettingField(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteGovernorsSettingField =
      await this.governorsService.deleteGovernorsSettingField(id, request.user);
    if (!deleteGovernorsSettingField) throw ApiCauses.DATA_INVALID;
    return deleteGovernorsSettingField;
  }

  @Get("field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get list governors setting field",
    summary: "get list governors setting field",
    description: "get list governors setting field",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "fieldNames",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "fieldValues",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "fieldDescriptions",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "settingId",
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getListGovernorsSettingField(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("fieldNames") fieldNames: string,
    @Query("fieldValues") fieldValues: string,
    @Query("fieldDescriptions") fieldDescriptions: string,
    @Query("settingId") settingId: number,
    @Req() request: any
  ): Promise<PaginationResponse<GovernorsSettingField>> {
    let listGovernorsSettingField =
      await this.governorsService.getListGovernorsSettingField(
        { settingId, fieldNames, fieldValues, fieldDescriptions },
        { page, limit }
      );
    if (!listGovernorsSettingField) throw ApiCauses.DATA_INVALID;
    return listGovernorsSettingField;
  }

  @Post("value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],

    operationId: "create governors setting value",
    summary: "create governors setting value",
    description: "create governors setting value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsSettingValue(
    @Body()
    createGovernorsSettingValueRequestDto: createGovernorsSettingValueRequestDto,
    @Req() request: RequestWithUser
  ) {
    let createGovernorsSettingValue =
      await this.governorsService.createGovernorsSettingValue(
        createGovernorsSettingValueRequestDto,
        request.user
      );
    if (!createGovernorsSettingValue) throw ApiCauses.DATA_INVALID;
    return createGovernorsSettingValue;
  }

  @Get("item-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get governors setting value by id",
    summary: "get governors setting value by id",

    description: "get governors setting value by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getGovernorsSettingValueById(@Query("id") id: string) {
    let governorsSettingValue =
      await this.governorsService.getGovernorsSettingValueById(id);
    if (!governorsSettingValue) throw ApiCauses.DATA_INVALID;
    return governorsSettingValue;
  }

  @Put("value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "update governors setting value",
    summary: "update governors setting value",
    description: "update governors setting value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateGovernorsSettingValue(
    @Query("id") id: string,
    @Body()
    createGovernorsSettingValueRequestDto: createGovernorsSettingValueRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateGovernorsSettingValue =
      await this.governorsService.updateGovernorsSettingValue(
        id,
        createGovernorsSettingValueRequestDto,
        request.user
      );
    if (!updateGovernorsSettingValue) throw ApiCauses.DATA_INVALID;
    return updateGovernorsSettingValue;
  }

  @Delete("value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "delete governors setting value",
    summary: "delete governors setting value",
    description: "delete governors setting value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteGovernorsSettingValue(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteGovernorsSettingValue =
      await this.governorsService.deleteGovernorsSettingValue(id, request.user);
    if (!deleteGovernorsSettingValue) throw ApiCauses.DATA_INVALID;
    return deleteGovernorsSettingValue;
  }

  @Get("value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get list governors setting value",
    summary: "get list governors setting value",
    description: "get list governors setting value",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "fieldValue",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "fieldId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "settingId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getListGovernorsSettingValue(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("fieldValue") fieldValue: string,
    @Query("fieldId") fieldId: number,
    @Query("settingId") settingId: number,
    @Query("governorId") governorId: number,
    @Req() request: any
  ): Promise<PaginationResponse<GovernorsSettingValue>> {
    let listGovernorsSettingValue =
      await this.governorsService.getListGovernorsSettingValue(
        { settingId,governorId, fieldValue, fieldId },
        { page, limit }
      );
    if (!listGovernorsSettingValue) throw ApiCauses.DATA_INVALID;
    return listGovernorsSettingValue;
  }

  @Post("vote-field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors vote field",
    summary: "create governors vote field",
    description: "create governors vote field",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsVoteField(
    @Body()
    createGovernorsVoteFieldRequestDto: createGovernorsVoteFieldRequestDto,
    @Req() request: RequestWithUser
  ) {
    let createGovernorsVoteField =
      await this.governorsService.createGovernorsVoteField(
        createGovernorsVoteFieldRequestDto,
        request.user
      );
    if (!createGovernorsVoteField) throw ApiCauses.DATA_INVALID;
    return createGovernorsVoteField;
  }

  @Get("item-vote-field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get governors vote field by id",
    summary: "get governors vote field by id",
    description: "get governors vote field by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async getGovernorsVoteFieldById(@Query("id") id: string) {
    let governorsVoteField =
      await this.governorsService.getGovernorsVoteFieldById(id);
    if (!governorsVoteField) throw ApiCauses.DATA_INVALID;
    return governorsVoteField;
  }

  @Put("vote-field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "update governors vote field",
    summary: "update governors vote field",
    description: "update governors vote field",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateGovernorsVoteField(
    @Query("id") id: string,
    @Body()
    createGovernorsVoteFieldRequestDto: createGovernorsVoteFieldRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateGovernorsVoteField =
      await this.governorsService.updateGovernorsVoteField(
        id,
        createGovernorsVoteFieldRequestDto,
        request.user
      );
    if (!updateGovernorsVoteField) throw ApiCauses.DATA_INVALID;
    return updateGovernorsVoteField;
  }

  @Delete("vote-field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "delete governors vote field",
    summary: "delete governors vote field",
    description: "delete governors vote field",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteGovernorsVoteField(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteGovernorsVoteField =
      await this.governorsService.deleteGovernorsVoteField(id, request.user);
    if (!deleteGovernorsVoteField) throw ApiCauses.DATA_INVALID;
    return deleteGovernorsVoteField;
  }

  @Get("vote-field")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get list governors vote field",
    summary: "get list governors vote field",
    description: "get list governors vote field",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "fieldName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "fieldDescription",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "settingId",
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getListGovernorsVoteField(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,

    @Query("fieldName") fieldName: string,
    @Query("fieldDescription") fieldDescription: string,
    @Query("settingId") settingId: number,
    @Req() request: any
  ): Promise<PaginationResponse<GovernorsVoteField>> {
    let listGovernorsVoteField =
      await this.governorsService.getListGovernorsVoteField(
        { fieldName, fieldDescription, settingId },
        { page, limit }
      );
    if (!listGovernorsVoteField) throw ApiCauses.DATA_INVALID;
    return listGovernorsVoteField;
  }

  @Post("vote-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors vote value",
    summary: "create governors vote value",
    description: "create governors vote value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsVoteValue(
    @Body()
    createGovernorsVoteValueRequestDto: createGovernorsVoteValueRequestDto,
    @Req() request: RequestWithUser
  ) {
    let createGovernorsVoteValue =
      await this.governorsService.createGovernorsVoteValue(
        createGovernorsVoteValueRequestDto,
        request.user
      );
    if (!createGovernorsVoteValue) throw ApiCauses.DATA_INVALID;
    return createGovernorsVoteValue;
  }

  @Get("item-vote-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get governors vote value by id",
    summary: "get governors vote value by id",
    description: "get governors vote value by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiQuery({ name: "id", type: "string", required: true })
  async getGovernorsVoteValueById(@Query("id") id: string) {
    let governorsVoteValue =
      await this.governorsService.getGovernorsVoteValueById(id);
    if (!governorsVoteValue) throw ApiCauses.DATA_INVALID;
    return governorsVoteValue;
  }

  @Put("vote-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "update governors vote value",
    summary: "update governors vote value",
    description: "update governors vote value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateGovernorsVoteValue(
    @Query("id") id: string,
    @Body()
    createGovernorsVoteValueRequestDto: createGovernorsVoteValueRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateGovernorsVoteValue =
      await this.governorsService.updateGovernorsVoteValue(
        id,
        createGovernorsVoteValueRequestDto,
        request.user
      );
    if (!updateGovernorsVoteValue) throw ApiCauses.DATA_INVALID;
    return updateGovernorsVoteValue;
  }

  @Delete("vote-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "delete governors vote value",
    summary: "delete governors vote value",
    description: "delete governors vote value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteGovernorsVoteValue(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteGovernorsVoteValue =
      await this.governorsService.deleteGovernorsVoteValue(id, request.user);
    if (!deleteGovernorsVoteValue) throw ApiCauses.DATA_INVALID;
    return deleteGovernorsVoteValue;
  }

  @Get("vote-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "get list governors vote value",
    summary: "get list governors vote value",
    description: "get list governors vote value",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "fieldValue",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "fieldId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "settingId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getListGovernorsVoteValue(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("fieldValue") fieldValue: string,
    @Query("fieldId") fieldId: number,
    @Query("settingId") settingId: number,
    @Query("governorId") governorId: number,
    @Req() request: any
  ): Promise<PaginationResponse<GovernorsVoteValue>> {
    let listGovernorsVoteValue =
      await this.governorsService.getListGovernorsVoteValue(
        { settingId,governorId, fieldValue, fieldId },
        { page, limit }
      );
    if (!listGovernorsVoteValue) throw ApiCauses.DATA_INVALID;
    return listGovernorsVoteValue;
  }

  @Post("all-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors all value",
    summary: "create governors all value",
    description: "create governors all value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsAllValue(
    @Body()
    createGovernorsSettingValueRequestDto: createGovernorsSettingValueRequestDto[],
    @Req() request: RequestWithUser
  ) {
    const createGovernorsSettingValues = [];

    for (let i = 0; i < createGovernorsSettingValueRequestDto.length; i++) {
      const createGovernorsSettingValue =
        await this.governorsService.createGovernorsSettingValue(
          createGovernorsSettingValueRequestDto[i],
          request.user
        );

      if (!createGovernorsSettingValue) {
        throw ApiCauses.DATA_INVALID;
      }

      createGovernorsSettingValues.push(createGovernorsSettingValue);
    }

    return createGovernorsSettingValues;
  }

  @Post("all-vote-value")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["governors"],
    operationId: "create governors all vote value",
    summary: "create governors all vote value",
    description: "create governors all vote value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createGovernorsAllVoteValue(
    @Body()
    createGovernorsVoteValueRequestDto: createGovernorsVoteValueRequestDto[],
    @Req() request: RequestWithUser
  ) {
    const createGovernorsVoteValues = [];

    for (let i = 0; i < createGovernorsVoteValueRequestDto.length; i++) {
      const createGovernorsVoteValue =
        await this.governorsService.createGovernorsVoteValue(
          createGovernorsVoteValueRequestDto[i],
          request.user
        );

      if (!createGovernorsVoteValue) {
        throw ApiCauses.DATA_INVALID;
      }

      createGovernorsVoteValues.push(createGovernorsVoteValue);
    }

    return createGovernorsVoteValues;
  }
}
