import {Controller, Get} from "@nestjs/common";
import {CurrencyConfigService} from "./currencyConfig.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('currency-config')
export class CurrencyConfigController {
    constructor(
        private readonly currencyConfigService: CurrencyConfigService,
    ) {
    }

    //api get list currency config
    @Get('list')
    @ApiOperation({
        tags: ["currency-config"],
        operationId: "list currency config",
        summary: "list currency config",
        description: "list currency config",
    })
    @ApiResponse({
        status: 200,
        description: "Successful",
    })
    async listCurrencyConfig() {
        const currencyConfigs = await this.currencyConfigService.listCurrencyConfig();
        return currencyConfigs;
    }

}