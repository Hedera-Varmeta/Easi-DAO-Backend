import {Module} from "@nestjs/common";
import {Address, CurrencyConfig, KmsCmk, KmsDataKey} from "../../database/entities";
import {TypeOrmModule} from "@nestjs/typeorm";
import {KmsService} from "./kms.service";
import {BlockchainService} from "./blockchain.service";
import {CurrencyRegistryService} from "./currency.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        TypeOrmModule.forFeature([CurrencyConfig, KmsCmk, KmsDataKey, Address]),
        HttpModule,
    ],
    exports: [TypeOrmModule, KmsService, BlockchainService, CurrencyRegistryService],
    providers: [KmsService, BlockchainService, CurrencyRegistryService],
})
export class CommonModule {
}