import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CurrencyConfig, CurrencyToken} from "../../database/entities";
import {CurrencyConfigService} from "./currencyConfig.service";
import {CurrencyConfigController} from "./currencyConfig.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CurrencyToken, CurrencyConfig
        ]),
    ],
    providers: [
        CurrencyConfigService
    ],
    controllers: [CurrencyConfigController],
})
export class CurrencyConfigModule {
}