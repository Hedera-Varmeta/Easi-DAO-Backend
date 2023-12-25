import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  RegisterWallet,
  RegisterHederaWallet,
} from "./request/register-wallet.dto";
import { ExternalWallet } from "./request/external-wallet.dto";
import { LoginResponse } from "./response/login.dto";
import * as argon2 from "argon2";
import { Admin, User } from "../../database/entities";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Register } from "./request/register.dto";
import { convertToObject, encrypt, randomNumberCode } from "../../shared/Utils";
import { MailService } from "../mail/mail.service";
import { AddressesService } from "../addresses/addresses.service";
import { S3 } from "aws-sdk";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { PaginationResponse } from "src/config/rest/paginationResponse";
import { getArrayPaginationBuildTotal, getOffset } from "src/shared/Utils";
import { ApiCauses } from "../../config/exception/apiCauses";
import { updateInfo } from "./request/update-user.dto";

var tokenMap = new Map();
var limitRequestLoginMap = new Map();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly addressesService: AddressesService,
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>
  ) {}

  isValidToken(token: string) {
    return this.jwtService.verify(token);
  }

  setValidToken(token: string) {
    tokenMap.set(encrypt(token), "1");
  }

  deleteValidToken(token: string) {
    tokenMap.delete(encrypt(token));
  }

  async login(user: any): Promise<LoginResponse> {
    const payload = { username: user.username, userId: user.id };
    const tokenLogin = this.jwtService.sign(payload);

    const { token, ...dataReturn } = user;

    return {
      ...dataReturn,
      token: tokenLogin,
    };
  }

  async getDetailUser(id: number) {
    let queryBuilder = this.dataSource
      .createQueryBuilder(User, "user")
      .select(
        "user.id, user.username, user.email, user.avatar_url as avatarUrl, user.first_name as firstName, user.last_name as lastName, user.date_of_birth as dateOfBirth, user.phone, user.created_at as createdAt, user.updated_at as updatedAt, user.is_active_2fa as isActive2fa, user.is_active_email_code as isActiveEmailCode, user.two_factor_authentication_secret as twoFactorAuthenticationSecret, user.email_code as emailCode, user.is_active_kyc as isActiveKyc, user.wallet, user.status, user.type, user.token,user.brand_id as brandId,user.group, user.vendor_name as vendorName,user.is_vendor as isVendor"
      )
      .where("user.id  = :Id", { Id: id });
    const user = await queryBuilder.execute();

    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async getUserByWallet(wallet: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
        wallet: wallet,
      },
    });
  }

  async getUserByData(data: any): Promise<User | undefined> {
    let user = null;

    if (data.username || data.accountId) {
      user = this.usersRepository.findOne({
        where: {
          username: data.username || data.accountId,
        },
      });
    }

    if (data.address) {
      user = this.usersRepository.findOne({
        where: {
          wallet: data.address,
        },
      });
    }

    return user;
  }

  async createUserByHederaWallet(data: RegisterHederaWallet): Promise<any> {
    let user = new User();
    user.username = data.accountId;
    user.wallet = data.address;
    user.type = "wallet";
    user.accountId = data.accountId;

    user = await this.usersRepository.save(user);

    const { token, ...dataUser } = user;

    return dataUser;
  }

  async createUserByWallet(data: RegisterWallet): Promise<any> {
    let user = new User();
    user.username = data.username;
    user.wallet = data.address;
    user.type = "wallet";

    user = await this.usersRepository.save(user);

    const { token, ...dataUser } = user;

    return dataUser;
  }

  async connectExternalWallet(
    data: ExternalWallet,
    userData: User
  ): Promise<any> {
    if (!userData || !userData.username) return false;
    let user = await this.getUserByUsername(userData.username);
    if (user.wallet) {
      throw ApiCauses.DUPLICATED_EMAIL_OR_USERNAME;
    } else {
      user.wallet = data.address;
      user.type = "wallet";
      user = await this.usersRepository.save(user);
      return user;
    }
  }

  async _registerUser(email: string, password: string) {
    let user = new User();
    await this.dataSource.transaction(async (transactional) => {
      user.username = email;
      user.type = "email";

      user = await transactional.save(user);
    });

    return user;
  }

  async getToken(user: User) {
    const token = this.jwtService.sign({
      username: user.username,
      time: Date.now(),
    });

    user.token = token;
    user = await this.usersRepository.save(user);

    return token;
  }

  async getUserByToken(token: string) {
    const data = convertToObject(this.jwtService.decode(token));

    if (
      !data ||
      !data.username ||
      !data.time ||
      Date.now() - data.time > parseInt(process.env.EXPRIRE_TIME_TOKEN)
    )
      return false;

    let user = await this.getUserByUsername(data.username);

    if (!user || !user.token || user.token !== token) return false;

    return user;
  }

  logout(token: string) {
    const tokenWithoutBearer = token.split(" ")[1];

    this.deleteValidToken(tokenWithoutBearer);
  }

  async getInformationUser(id: number) {
    let queryBuilder = this.dataSource
      .createQueryBuilder(User, "user")
      .select(
        `
            user.id,
            user.username,
            user.avatar_url as avatarUrl,
            user.first_name as firstName,
            user.last_name as lastName,
            user.date_of_birth as dateOfBirth,
            user.phone,
            user.wallet,
            user.status,
            user.type,
            user.account_id as accountId
        `
      )
      .where("user.id  = :Id", { Id: id });
    const user = await queryBuilder.execute();
    return user;
  }

  async updateInfo(data: updateInfo, id: Number, file: any) {
    console.log(data);
    if (file) {
      const upload = await this.upload(file);

      if (!upload || !upload.Location) return false;
      data.avatarUrl = upload.Location;
    }

    let userData = await this.usersRepository.findOne({
      where: {
        id: Number(id),
      },
    });
    userData.avatarUrl = data.avatarUrl;
    userData.firstName = data.firstName;
    userData.lastName = data.lastName;
    data.dateOfBirth && (userData.dateOfBirth = new Date(data.dateOfBirth));
    userData.phone = data.phone;

    userData =  await this.usersRepository.save(userData);

    let user = await this.getInformationUser(Number(id));
    return user;
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
      Key: "users/" + String(date) + String(name),
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
}
