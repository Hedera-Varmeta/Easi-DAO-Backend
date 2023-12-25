import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Governors,Proposal, DAO,User, VoteOption, Vote, VoteHistory, DAOMember} from "src/database/entities";
import {ProposalController} from "./proposal.controller";
import {ProposalService} from "./proposal.service";
import { AuthService } from "../user/auth.service";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "../user/jwt.strategy";
import { MailService } from '../mail/mail.service';
import {MailModule} from '../mail/mail.module';
import {AddressesModule} from '../addresses/addresses.module';
import {AddressesService} from '../addresses/addresses.service';
import {CommonModule} from '../common/common.module';
import {PassportModule} from '@nestjs/passport';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Governors,
            User,
            DAO,
            Proposal,
            VoteOption,
            Vote,
            VoteHistory,
            DAOMember
        ]),
        PassportModule,
        MailModule,
        AddressesModule,
        CommonModule,
        AddressesModule,
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'abcxyz',
        }),
    ],
    providers: [
        ProposalService,
        AuthService,
        MailService
    ],
    controllers: [ProposalController],
})
export class ProposalModule {
}
