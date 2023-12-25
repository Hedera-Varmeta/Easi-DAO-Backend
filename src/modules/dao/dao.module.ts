import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {
  Governors,
  DAO,
  User,
  DAOMember,
  TokenTransfer,
  DAOSocial,
  DAODelegate,
  DAOProfile,
  DAOTreasury,
  TypeTreasury,
  LatestBlock,
  TreasuryTransaction
} from "src/database/entities";
import { DaoController } from "./dao.controller";
import { DaoService } from "./dao.service";
import { AuthService } from "../user/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../user/jwt.strategy";
import { MailService } from "../mail/mail.service";
import { MailModule } from "../mail/mail.module";
import { AddressesModule } from "../addresses/addresses.module";
import { AddressesService } from "../addresses/addresses.service";
import { CommonModule } from "../common/common.module";
import { PassportModule } from "@nestjs/passport";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Governors,
      User,
      DAO,
      DAOMember,
      TokenTransfer,
      DAODelegate,
      DAOSocial,
      DAOProfile,
      TypeTreasury,
      DAOTreasury,
      LatestBlock,
      TreasuryTransaction
    ]),
    PassportModule,
    MailModule,
    AddressesModule,
    CommonModule,
    AddressesModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || "abcxyz",
    }),
  ],
  providers: [DaoService, AuthService, MailService],
  controllers: [DaoController],
})
export class DaoModule {}
