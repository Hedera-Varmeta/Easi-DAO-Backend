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
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ApiCauses } from "src/config/exception/apiCauses";
import { ProposalService } from "./proposal.service";
import {
  createProposalRequestDto,
  createVoteOption,
  createVoteRequestDto,
  createVoteProposalRequestDto,
} from "./request/proposalRequest.dto";
import { JwtAuthGuard } from "../user/jwt-auth.guard";
import RequestWithUser from "../user/requestWithUser.interface";
import { checkImage } from "src/shared/Utils";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller("proposal")
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Post("vote-option")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "voteOptionProposal",
    summary: "Vote option proposal",
    description: "Vote option proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Vote option proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Vote option proposal failed",
    type: ApiCauses,
  })
  async voteOptionProposal(
    @Body() createVoteOption: createVoteOption,
    @Req() request: RequestWithUser
  ) {
    return this.proposalService.voteOptionProposal(createVoteOption, request);
  }

  @Get("vote-option")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "getVoteOptionProposal",
    summary: "Get vote option proposal",
    description: "Get vote option proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get vote option proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Get vote option proposal failed",
    type: ApiCauses,
  })
  async getVoteOptionProposal(@Query("id") id: number) {
    return this.proposalService.getVoteOptionProposal(id);
  }

  @Put("vote-option")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "updateVoteOptionProposal",
    summary: "Update vote option proposal",
    description: "Update vote option proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update vote option proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Update vote option proposal failed",
    type: ApiCauses,
  })
  async updateVoteOptionProposal(
    @Query("id") id: number,
    @Body() createVoteOption: createVoteOption,
    @Req() request: RequestWithUser
  ) {
    return this.proposalService.updateVoteOptionProposal(
      id,
      createVoteOption,
      request
    );
  }

  @Delete("vote-option")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "deleteVoteOptionProposal",
    summary: "Delete vote option proposal",
    description: "Delete vote option proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete vote option proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Delete vote option proposal failed",
    type: ApiCauses,
  })
  async deleteVoteOptionProposal(@Query("id") id: number) {
    return this.proposalService.deleteVoteOptionProposal(id);
  }

  @Get("list-vote-option")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "listVoteOptionProposal",
    summary: "List vote option proposal",
    description: "List vote option proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List vote option proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "List vote option proposal failed",
    type: ApiCauses,
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Limit",
  })
  async listVoteOptionProposal(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Req() request: any
  ) {
    return this.proposalService.listVoteOptionProposal({ page, limit });
  }

  @Post("vote")
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "voteProposal",
    summary: "Vote proposal",
    description: "Vote proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Vote proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Vote proposal failed",
    type: ApiCauses,
  })
  async voteProposal(
    @Body() createProposalDto: createVoteRequestDto,
    @Req() request: RequestWithUser
  ) {
    return this.proposalService.voteProposal(createProposalDto, request);
  }

  @Get("vote")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "getVoteProposal",
    summary: "Get vote proposal",
    description: "Get vote proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get vote proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Get vote proposal failed",
    type: ApiCauses,
  })
  async getVoteProposal(@Query("id") id: number) {
    return this.proposalService.getVoteProposal(id);
  }

  @Get("list-vote")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "listVoteProposal",
    summary: "List vote  proposal",
    description: "List vote  proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List vote  proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "List vote proposal failed",
    type: ApiCauses,
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Limit",
  })
  async listVoteProposal(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Req() request: any
  ) {
    return this.proposalService.listVoteProposal({ page, limit });
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    tags: ["proposal"],
    operationId: "createProposal",
    summary: "Create proposal",
    description: "Create proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Create proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Create proposal failed",
    type: ApiCauses,
  })
  async createProposal(
    @Body() createProposalDto: createProposalRequestDto,
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) checkImage(file);
    return this.proposalService.createProposal(createProposalDto, request,file);
  }

  @Put("update")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "updateProposal",
    summary: "Update proposal",
    description: "Update proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Update proposal failed",
    type: ApiCauses,
  })
  async updateProposal(
    @Query("id") id: number,
    @Body() createProposalDto: createProposalRequestDto,
    @Req() request: RequestWithUser
  ) {
    return this.proposalService.updateProposal(id, createProposalDto, request);
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "deleteProposal",
    summary: "Delete proposal",
    description: "Delete proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Delete proposal failed",
    type: ApiCauses,
  })
  async deleteProposal(@Query("id") id: number) {
    return this.proposalService.deleteProposal(id);
  }

  @Get("item")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "getProposal",
    summary: "Get proposal",
    description: "Get proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Get proposal failed",
    type: ApiCauses,
  })
  async getProposal(@Query("id") id: number) {
    return this.proposalService.getProposal(id);
  }

  @Get("list-proposal")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "listProposal",
    summary: "List proposal",
    description: "List proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "List proposal failed",
    type: ApiCauses,
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Limit",
  })
  @ApiQuery({
    name: "daoId",
    type: Number,
    required: false,
    description: "daoId",
  })
  @ApiQuery({
    name: "daoName",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: Number,
  })
  async listProposal(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("daoId") daoId: number,
    @Query("status") status: number,
    @Req() request: any
  ) {
    return this.proposalService.listProposal(
      { daoId, status },
      { page, limit }
    );
  }

  @Post("vote-proposal")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "voteProposal proposal",
    summary: "Vote proposal proposal",
    description: "Vote proposal proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Vote proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Vote proposal failed",
    type: ApiCauses,
  })
  async voteProposalValue(
    @Body() createVoteProposalDto: createVoteProposalRequestDto,
    @Req() request: RequestWithUser
  ) {
    return this.proposalService.voteProposalValue(
      createVoteProposalDto,
      request
    );
  }

  @Get("vote-proposal")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "getVoteProposal proposal",
    summary: "Get vote proposal proposal",
    description: "Get vote proposal proposal",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get vote proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Get vote proposal failed",
    type: ApiCauses,
  })
  async getVoteValueProposal(@Query("id") id: number) {
    return this.proposalService.getVoteValueProposal(id);
  }

  @Get("list-vote-proposal")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "listVoteProposal Value",
    summary: "List vote  proposal Value",
    description: "List vote  proposal Value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List vote  proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "List vote proposal failed",
    type: ApiCauses,
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Limit",
  })
  @ApiQuery({
    name: "proposalId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "voterId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "voteOptionId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "enumSC",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "voteAddress",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: Number,
  })
  async listVoteValueProposal(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("voteAddress") voteAddress: string,
    @Query("enumSC") enumSC: number,
    @Query("voteOptionId") voteOptionId: number,
    @Query("proposalId") proposalId: number,
    @Query("voterId") voterId: number,
    @Query("status") status: number,

    @Req() request: any
  ) {
    return this.proposalService.listVoteValueProposal(
      { voteAddress, enumSC, voteOptionId, proposalId, voterId, status },
      { page, limit }
    );
  }

  @Get("all-vote-proposal")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "listVoteProposal Value",
    summary: "List vote  proposal Value",
    description: "List vote  proposal Value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List vote  proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "List vote proposal failed",
    type: ApiCauses,
  })

  @ApiQuery({
    name: "proposalId",
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "num of limit"
  })
  async allVoteProposal(
    @Query("proposalId") proposalId: number,
    @Query("limit") limit: number,
    @Req() request: any
  ) {
    return this.proposalService.allVoteProposal(
      { proposalId ,limit}
    );
  }

  @Get("check-vote/:proposalId")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["proposal"],
    operationId: "Check user has voted or not",
    summary: "Check user has voted or not",
    description: "Check user has voted or not",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return true if user has voted",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Check user vote has failed",
    type: ApiCauses,
  })
  async checkUserVote(
      @Param('proposalId') proposalId: number,
      @Req() request: RequestWithUser
  ) {
    return this.proposalService.checkUserVote(+proposalId, request.user);
  }

  @Get("list-comment-proposal")
  @ApiOperation({
    tags: ["proposal"],
    operationId: "listCommentProposal Value",
    summary: "List comment  proposal Value",
    description: "List comment  proposal Value",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List comment  proposal success",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "List vote proposal failed",
    type: ApiCauses,
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Limit",
  })
  @ApiQuery({
    name: "proposalId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "voterId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "voteOptionId",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "enumSC",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "voteAddress",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: Number,
  })
  async listCommentValueProposal(
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("voteAddress") voteAddress: string,
    @Query("enumSC") enumSC: number,
    @Query("voteOptionId") voteOptionId: number,
    @Query("proposalId") proposalId: number,
    @Query("voterId") voterId: number,
    @Query("status") status: number,

    @Req() request: any
  ) {
    return this.proposalService.listCommentValueProposal(
      { voteAddress, enumSC, voteOptionId, proposalId, voterId, status },
      { page, limit }
    );
  }
}
