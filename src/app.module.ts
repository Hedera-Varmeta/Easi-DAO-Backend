import {Logger, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './modules/admin/auth.module';
import {TransformInterceptor} from './config/rest/transform.interceptor';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {ExceptionFilter} from './config/exception/exception.filter';
import {DataSource} from "typeorm";
import {databaseConfig} from "./config/database.config";
import {CommonModule} from "./modules/common/common.module";
import {MailModule} from "./modules/mail/mail.module";
import {AddressesModule} from "./modules/addresses/addresses.module";
import {CurrencyConfig, Proposal} from "./database/entities";
import {CurrencyConfigModule} from "./modules/currency-config/currencyConfig.module";
import {CurrencyTokenModule} from "./modules/currency-token/currencyToken.module";
import {NotificationModule} from "./modules/notification/notification.module";
import {AuthUserModule} from "./modules/user/auth.module";
import {GovernorsModule} from "./modules/governors/governors.module";
import {ProposalModule} from "./modules/proposal/proposal.module";
import { DaoModule } from './modules/dao/dao.module';
@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRoot(databaseConfig),
        AuthModule,
        CommonModule,
        MailModule,
        AddressesModule,
        CurrencyConfigModule,
        CurrencyTokenModule,
        NotificationModule,
        AuthUserModule,
        GovernorsModule,
        DaoModule,
        ProposalModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ExceptionFilter,
        },
        Logger
    ],
})
export class AppModule {
    constructor(private dataSource: DataSource) {
    }
}
