import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Login } from "./request/login.dto";
import { LoginResponse } from "./response/login.dto";
import { EmptyObject } from "../../shared/response/emptyObject.dto";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { LoginBase } from "./response/loginBase.dto";
import { ApiCauses } from "../../config/exception/apiCauses";
import { EmptyObjectBase } from "../../shared/response/emptyObjectBase.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Register } from "./request/register.dto";
import { RegisterResponse } from "./response/register.dto";
import { RegisterBase } from "./response/registerBase.dto";
import { ResetPassword } from "./request/reset-password.dto";
import { UpdatePassword } from "./request/update-password.dto";
import { TwoFactorAuthenticationService } from "./twoFactorAuthentication.service";
import { UsersService } from "./user.service";
import { updateInfo} from "./request/update-user.dto";
import RequestWithUser from "./requestWithUser.interface";
import { JwtService } from "@nestjs/jwt";
import {
  RegisterWallet,
  RegisterHederaWallet,
} from "./request/register-wallet.dto";
import { ExternalWallet } from "./request/external-wallet.dto";
import { LoginWallet, LoginHederaWallet } from "./request/login-wallet.dto";
import { isPhoneNumber } from "../../shared/Utils";
import { checkImage } from "src/shared/Utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { PaginationResponse } from "src/config/rest/paginationResponse";
import * as argon2 from "argon2";
const {
  Client,
  Ed25519PrivateKey,
  AccountId,
  PublicKey,
  PrivateKey,
} = require("@hashgraph/sdk");
const { Ed25519PublicKey, Ed25519Signature } = require("@hashgraph/sdk");

const Web3 = require("web3");

@Controller("user")
export class AuthController {
  _web3 = new Web3();

  constructor(
    private jwtService: JwtService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post("/logout")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["auth"],
    operationId: "logout",
    summary: "Logout",
    description: "Logout",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: EmptyObjectBase,
  })
  async logout(@Req() request: any): Promise<EmptyObject> {
    const token = request.headers.authorization;
    this.authService.logout(token);
    return new EmptyObject();
  }

  @Post("/register-hedera-wallet")
  @ApiOperation({
    tags: ["auth"],
    operationId: "register hedera request",
    summary: "register hedera request",
    description: "register hedera request",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: RegisterBase,
  })
  async registerHederaWallet(
    @Body() data: RegisterHederaWallet
  ): Promise<RegisterResponse | EmptyObject> {
    const { publicKey, signature, message } = data;
    let isValidSignature = true;
    if (data.type === 1) {
      isValidSignature = await this.verifySignature(
        publicKey,
        signature,
        message
      );
    }
    if (isValidSignature) {
      let user = await this.authService.getUserByData(data);
      if (user) throw ApiCauses.DUPLICATED_WALLET;

      user = await this.authService.createUserByHederaWallet(data);
      return user;
    } else {
      // Chữ ký không hợp lệ
      throw ApiCauses.INVALID_SIGNATURE_WALLET;
    }
  }

  @Post("/register-external-wallet")
  @ApiOperation({
    tags: ["auth"],
    operationId: "register external request",
    summary: "register external request",
    description: "register external request",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: RegisterBase,
  })
  async registerExternalWallet(
    @Body() data: RegisterWallet
  ): Promise<RegisterResponse | EmptyObject> {
    // check address and signature
    const address = this._web3.eth.accounts.recover(
      process.env.SIGNATURE_TEXT,
      data.signature
    );

    if (!address || address != data.address)
      throw ApiCauses.INVALID_SIGNATURE_WALLET;

    let user = await this.authService.getUserByData(data);

    if (user) throw ApiCauses.DUPLICATED_EMAIL_OR_USERNAME;

    user = await this.authService.createUserByWallet(data);

    return user;
  }

  @Post("/login-hedera-wallet")
  @ApiOperation({
    tags: ["auth"],
    operationId: "login hedera request",
    summary: "login hedera request",
    description: "login hedera request",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: RegisterBase,
  })
  async loginHederaWallet(
    @Body() data: LoginHederaWallet
  ): Promise<RegisterResponse | EmptyObject> {
    const { publicKey, signature, message } = data;
    let isValidSignature = true;
    if (data.type == 1) {
      isValidSignature = await this.verifySignature(
        publicKey,
        signature,
        message
      );
    }

    if (isValidSignature) {
      let user = await this.authService.getUserByData(data);

      if (user) return this.authService.login(user);

      user = await this.authService.createUserByHederaWallet(data);

      return this.authService.login(user);
    } else {
      // Chữ ký không hợp lệ
      throw ApiCauses.INVALID_SIGNATURE_WALLET;
    }
  }

  @Post("/login-external-wallet")
  @ApiOperation({
    tags: ["auth"],
    operationId: "login external request",
    summary: "login external request",
    description: "login external request",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: RegisterBase,
  })
  async loginExternalWallet(
    @Body() data: LoginWallet
  ): Promise<RegisterResponse | EmptyObject> {
    // check address and signature
    const address = this._web3.eth.accounts.recover(
      process.env.SIGNATURE_TEXT,
      data.signature
    );

    if (!address || address != data.address)
      throw ApiCauses.INVALID_SIGNATURE_WALLET;

    const user = await this.authService.getUserByData(data);
    //if (!user) throw ApiCauses.USER_ERROR;
    if (!user || (user && user.status == "request")) throw ApiCauses.USER_ERROR;

    return this.authService.login(user);
  }

  @Post("/connect-external-wallet")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["auth"],
    operationId: "connect external request",
    summary: "connect external request",
    description: "connect external request",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: RegisterBase,
  })
  async connectExternalWallet(
    @Body() data: ExternalWallet,
    @Req() request: any
  ): Promise<RegisterResponse | EmptyObject> {
    if (!request || !request.user || !request.user.id || !request.user.username)
      throw ApiCauses.USER_NOT_ACCESS;

    // check address and signature
    const address = this._web3.eth.accounts.recover(
      process.env.SIGNATURE_TEXT,
      data.signature
    );

    if (!address || address != data.address)
      throw ApiCauses.INVALID_SIGNATURE_WALLET;

    const checkWallet = await this.authService.getUserByData(data);
    if (checkWallet && checkWallet.wallet)
      throw ApiCauses.DUPLICATED_EMAIL_OR_USERNAME;

    const userData = request.user;

    const user = await this.authService.connectExternalWallet(data, userData);

    return user;
  }

  async verifySignature(publicKeyString, signatureString, message) {
    try {
      if (!publicKeyString) {
        const privateKey = PrivateKey.generate();
        publicKeyString = privateKey.publicKey;
      }

      console.log("publicKeyString", publicKeyString.toString());
      const signatureBytes = Buffer.from(signatureString, "hex");
      const messageBytes = Buffer.from(message, "utf8");
      console.log("signatureBytes", signatureBytes);
      const isValidSignature = publicKeyString.verify(
        signatureBytes,
        messageBytes
      );

      return isValidSignature;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }

  @Get("info") 
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({
    tags: ["auth"],
    operationId: "get info",
    summary: "get info",
    description: "get info",
  })  
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: RegisterBase,
  })

  async getInfo(@Req() request: any): Promise<RegisterResponse | EmptyObject> {
    if (!request || !request.user || !request.user.id || !request.user.username)
      throw ApiCauses.USER_NOT_ACCESS;

    const user = await this.authService.getInformationUser(request.user.id);
    return user;
  }


  @Post("/update-info")
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ["auth"],
    operationId: "update info",
    summary: "update info",
    description: "update info",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful",
    type: RegisterBase,
  })
  async updateInfo(
    @Body() data: updateInfo,
    @Req() request: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<RegisterResponse | EmptyObject> {
    if (!request || !request.user || !request.user.id || !request.user.username)
      throw ApiCauses.USER_NOT_ACCESS;
    if (file) checkImage(file);

    const user = await this.authService.updateInfo(data, request.user.id,file);
    return user;
  }

}
