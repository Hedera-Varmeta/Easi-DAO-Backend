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
import {WorkerModule} from "./modules/worker/worker.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRoot(databaseConfig),
        AuthModule,
        WorkerModule,
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
export class AppWorkerModule {
    constructor(private dataSource: DataSource) {
    }
}
