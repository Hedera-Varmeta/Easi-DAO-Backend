import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Governors,GovernorsType,LatestBlock,GovernorsSetting,GovernorsSettingField,GovernorsSettingValue, User, GovernorsVoteField, GovernorsVoteValue} from "src/database/entities";
import {GovernorsController} from "./governors.controller";
import {GovernorsService} from "./governors.service";
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
            GovernorsType,
            User,
            GovernorsSetting,
            GovernorsSettingField,
            GovernorsSettingValue,
            GovernorsVoteField,
            GovernorsVoteValue,
            LatestBlock
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
        GovernorsService,
        AuthService,
        MailService
    ],
    controllers: [GovernorsController],
})
export class GovernorsModule {
}
