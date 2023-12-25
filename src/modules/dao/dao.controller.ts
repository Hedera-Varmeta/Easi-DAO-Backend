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
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { ApiCauses } from "src/config/exception/apiCauses";
import { DaoService } from "./dao.service";
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
import { JwtAuthGuard } from "../user/jwt-auth.guard";
import RequestWithUser from "../user/requestWithUser.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { checkImage } from "src/shared/Utils";

@Controller("dao")
export class DaoController {
  constructor(private daoService: DaoService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("logo"))
  @ApiOperation({
    tags: ["dao"],
    operationId: "create dao",
    summary: "create dao",
    description: "create dao",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  @ApiConsumes("multipart/form-data")
  async createDao(
    @Body() createDaoRequestDto: createDaoRequestDto,
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) checkImage(file);
    let createDao = await this.daoService.createDao(
      createDaoRequestDto,
      request.user,
      file
    );
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Post("explore")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "explore dao",
    summary: "explore dao",
    description: "explore dao",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async exploreDao(
    @Body() exploreDaoRequestDto: exploreDao,
    @Req() request: RequestWithUser
  ) {
    let exploreDao = await this.daoService.exploreDao(
      exploreDaoRequestDto,
      request.user
    );
    if (!exploreDao) throw ApiCauses.DATA_INVALID;
    return exploreDao;
  }

  @Get("item")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get dao by id",
    summary: "get dao by id",
    description: "get dao by id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async getDaoById(@Query("id") id: string) {
    let getDaoById = await this.daoService.getDaoById(id);
    if (!getDaoById) throw ApiCauses.DATA_INVALID;
    return getDaoById;
  }

  @Put("update")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "update dao",
    summary: "update dao",
    description: "update dao",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateDao(
    @Query("id") id: string,
    @Body() createDaoRequestDto: createDaoRequestDto,
    @Req() request: RequestWithUser
  ) {
    let updateDao = await this.daoService.updateDao(
      id,
      createDaoRequestDto,
      request.user
    );
    if (!updateDao) throw ApiCauses.DATA_INVALID;
    return updateDao;
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "delete dao",
    summary: "delete dao",
    description: "delete dao",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteGovernors(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let deleteDao = await this.daoService.deleteDao(id, request.user);
    if (!deleteDao) throw ApiCauses.DATA_INVALID;
    return deleteDao;
  }

  @Get("list")
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list dao",
    summary: "get list dao",
    description: "get list dao",
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
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: Number,
  })
  async getListDao(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Query("governorId") governorId: number,
    @Query("status") status: number
  ) {
    let getListDao = await this.daoService.getListDao(
      { daoName, governorId, status },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Get("my-daos")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list my dao",
    summary: "get list my dao",
    description: "get list my dao",
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
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: Number,
  })
  async getMyListDao(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Query("governorId") governorId: number,
    @Query("status") status: number,
    @Req() request: RequestWithUser
  ) {
    let userId = request.user.id;
    let getListDao = await this.daoService.getMyListDao(
      { daoName, governorId, userId, status },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Get("my-member-daos")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list member dao",
    summary: "get list member dao",
    description: "get list member dao",
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
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  async getMyListDaoMember(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Query("governorId") governorId: number,
    @Req() request: RequestWithUser
  ) {
    let userId = request.user.id;
    let getListDao = await this.daoService.getMyListDaoMember(
      { daoName, governorId, userId },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Get("membership-daos")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list membership dao",
    summary: "get list membership dao",
    description: "get list membership dao",
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
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "id",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  async getListDaoMembership(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Query("governorId") governorId: number,
    @Query("id") id: number,
    @Req() request: RequestWithUser
  ) {
    let getListDao = await this.daoService.getListDaoMembership(
      { id, daoName, governorId },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Get("list-explore")
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list explore dao",
    summary: "get list explore dao",
    description: "get list explore dao",
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
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  async getListExploreDao(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Query("governorId") governorId: number
  ) {
    let getListDao = await this.daoService.getListExploreDao(
      { daoName, governorId },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Get("list-transactions")
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list transactions dao",
    summary: "get list transactions dao",
    description: "get list transactions dao",
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
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "governorId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "id",
    required: false,
    type: Number,
  })
  async getListTransactionTokenByDao(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Query("governorId") governorId: number,
    @Query("id") id: number,
    @Req() request: RequestWithUser
  ) {
    let getListDao = await this.daoService.getListTransactionTokenByDao(
      { id, daoName, governorId },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Get("delegate-daos")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list delegate dao",
    summary: "get list delegate dao",
    description: "get list delegate dao",
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
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
  })
  async getListDelegateByDao(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Query("id") id: number,
    @Req() request: RequestWithUser
  ) {
    let getListDelegate = await this.daoService.getListDelegateByDao(
      { id, daoName },
      { page, limit }
    );
    if (!getListDelegate) throw ApiCauses.DATA_INVALID;
    return getListDelegate;
  }

  @Get("received-delegate")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list received delegate ",
    summary: "get list received delegate ",
    description: "get list received delegate ",
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
    name: "daoName",
    required: false,
    type: String,
  })
  async getListReceivedDelegate(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoName") daoName: string,
    @Req() request: RequestWithUser
  ) {
    let userId = request.user.id;
    let getListDao = await this.daoService.getListReceivedDelegate(
      { daoName, userId },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Post("delegate")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "create delegate",
    summary: "create delegate",
    description: "create delegate",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async delegateDao(
    @Body() delegateDao: delegateDao,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.delegateDao(
      delegateDao,
      request.user
    );
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Get("top-delegate")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get top delegate dao",
    summary: "get top delegate dao",
    description: "get top delegate dao",
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
    name: "search",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "orderBalance",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
  })
  async getTopDelegate(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("search") search: string,
    @Query("id") id: number,
    @Query("orderBalance") orderBalance: number
  ) {
    let getListDao = await this.daoService.getTopDelegate(
      { search, id, orderBalance },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Post("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "create dao delegate",
    summary: "create dao delegate",
    description: "create dao delegate",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createDaoProfile(
    @Body() createProfile: createProfileDto,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.createProfile(
      createProfile,
      request.user
    );
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }
  @Get("profile")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get profile delegate dao",
    summary: "get profile delegate dao",
    description: "get profile delegate dao",
  })
  @ApiQuery({
    name: "address",
    required: true,
    type: String,
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
  })
  async getDaoProfile(
    @Query("address") address: string,
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.getProfile(
      { id, address },
      request.user
    );
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }
  @Get("check-delegate")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "check delegate dao",
    summary: "check delegate dao",
    description:
      "latest delegated status | 0 is not delegated | 1 is delegated myself | 2 is delegated someone else",
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
    description: "daoId",
  })
  async checkDelegate(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.checkDelegate({ id }, request.user);
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Post("type-treasury")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "create type treasury",
    summary: "create type treasury",
    description: "create type treasury",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createTypeTreasury(
    @Body() createTypeTreasury: createTypeTreasuryDto,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.createTypeTreasury(
      createTypeTreasury
    );
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Put("type-treasury")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "update type treasury",
    summary: "update type treasury",
    description: "update type treasury",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateTypeTreasury(
    @Body() updateTypeTreasury: updateTypeTreasuryDto,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.updateTypeTreasury(
      updateTypeTreasury
    );
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Get("type-treasury")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get type treasury",
    summary: "get type treasury",
    description: "get type treasury",
  })
  async getTypeTreasury(@Query("id") id: string) {
    let createDao = await this.daoService.getTypeTreasury(id);
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Delete("type-treasury")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "delete type treasury",
    summary: "delete type treasury",
    description: "delete type treasury",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteTypeTreasury(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.deleteTypeTreasury(id);
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Get("list-type-treasury")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list type treasury",
    summary: "get list type treasury",
    description: "get list type treasury",
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
    name: "id",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "typeName",
    required: false,
    type: String,
  })
  async getListTypeTreasury(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("id") id: number,
    @Query("typeName") typeName: string
  ) {
    let getListDao = await this.daoService.getListTypeTreasury(
      { id, typeName },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Post("treasury")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "create treasury",
    summary: "create treasury",
    description: "create treasury",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createTreasury(
    @Body() createTreasury: createTreasuryDto,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.createTreasury(createTreasury);
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Post("treasury/batch")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "create treasury batch",
    summary: "create treasury batch",
    description: "create treasury batch",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createTreasuryBatch(
    @Body() createTreasuryList: createTreasuryDto[], // Change the parameter to accept an array
    @Req() request: RequestWithUser
  ) {
    const treasuryList = await Promise.all(
      createTreasuryList.map((createTreasury) =>
        this.daoService.createTreasury(createTreasury)
      )
    );
    return treasuryList;
  }

  @Put("treasury")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "update treasury",
    summary: "update treasury",
    description: "update treasury",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateTreasury(
    @Body() updateTreasury: updateTreasuryDto,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.updateTreasury(updateTreasury);
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Get("treasury")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get treasury",
    summary: "get treasury",

    description: "get treasury",
  })
  async getTreasury(@Query("id") id: string) {
    let createDao = await this.daoService.getTreasury(id);
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Delete("treasury")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "delete treasury",
    summary: "delete treasury",
    description: "delete treasury",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async deleteTreasury(
    @Query("id") id: string,
    @Req() request: RequestWithUser
  ) {
    let createDao = await this.daoService.deleteTreasury(id);
    if (!createDao) throw ApiCauses.DATA_INVALID;
    return createDao;
  }

  @Get("list-treasury")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list treasury",
    summary: "get list treasury",
    description: "get list treasury",
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
    name: "id",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "daoId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "typeId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "tokenName",
    required: false,
    type: String,
  })
  async getListTreasury(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("id") id: number,
    @Query("daoId") daoId: number,
    @Query("typeId") typeId: number,
    @Query("tokenName") tokenName: string
  ) {
    let getListDao = await this.daoService.getListTreasury(
      { id, daoId, typeId, tokenName },
      { page, limit }
    );
    if (!getListDao) throw ApiCauses.DATA_INVALID;
    return getListDao;
  }

  @Post("social")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "create social dao",
    summary: "create social dao",
    description: "create social dao",
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
    description: "DAO id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async createSocial(@Query("id") id: string, @Body() socialDto: SocialDto) {
    let createSocial = await this.daoService.createSocial(id, socialDto);
    if (!createSocial) throw ApiCauses.DATA_INVALID;
    return createSocial;
  }

  @Get("social")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list social dao",
    summary: "get list social dao",
    description: "get list social dao",
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
  })
  async getListSocial(
    @Query("id") id: number,
    @Req() request: RequestWithUser
  ) {
    let getListDelegate = await this.daoService.getListSocial(id);
    return getListDelegate;
  }

  @Delete("social")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "delete social of dao",
    summary: "delete social of dao",
    description: "delete social of dao",
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
  })
  async deleteSocial(@Query("id") id: string, @Req() request: RequestWithUser) {
    let deleteSocial = await this.daoService.deleteSocial(id);
    if (!deleteSocial) throw ApiCauses.DATA_INVALID;
    return deleteSocial;
  }

  @Put("social")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["dao"],
    operationId: "update social dao",
    summary: "update social dao",
    description: "update social dao",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
  })
  async updateSocial(@Query("id") id: string, @Body() socialDto: SocialDto) {
    let updateSocial = await this.daoService.updateSocial(id, socialDto);
    if (!updateSocial) throw ApiCauses.DATA_INVALID;
    return updateSocial;
  }

  @Get("list-treasury-withdraw-transactions")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list treasury withdraw",
    summary: "get list treasury withdraw",
    description: "get list treasury withdraw",
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
    name: "token",
    required: false,
    type: String,
  })
  async getListTreasuryWithdraw(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("token") token: string
  ) {
    let getListWithdraw = await this.daoService.getListTreasuryWithdraw(
      { token },
      { page, limit }
    );
    if (!getListWithdraw) throw ApiCauses.DATA_INVALID;
    return getListWithdraw;
  }

  @Get("list-treasury-deposit-transactions")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list treasury deposit",
    summary: "get list treasury deposit",
    description: "get list treasury deposit",
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
    name: "token",
    required: false,
    type: String,
  })
  async getListTreasuryDeposit(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("token") token: string
  ) {
    let getListDeposit = await this.daoService.getListTreasuryDeposit(
      { token },
      { page, limit }
    );
    if (!getListDeposit) throw ApiCauses.DATA_INVALID;
    return getListDeposit;
  }

  @Get("list-treasury-transactions")
  @ApiOperation({
    tags: ["dao"],
    operationId: "get list treasury transactions",
    summary: "get list treasury transactions",
    description: "get list treasury transactions",
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
    name: "token",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "type",
    required: false,
    type: Number,
  })
  async getListTreasuryTransactions(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number, // @Query("token") token: string,
    @Query("token") token: string,
    @Query("type") type: number
  ) {
    let getListDeposit = await this.daoService.getListTreasuryTransactions(
      { token, type },
      { page, limit }
    );
    if (!getListDeposit) throw ApiCauses.DATA_INVALID;
    return getListDeposit;
  }


}
