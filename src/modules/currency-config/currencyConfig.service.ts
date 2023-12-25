import {Injectable} from "@nestjs/common";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {CurrencyConfig, CurrencyToken} from "../../database/entities";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class CurrencyConfigService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @InjectRepository(CurrencyConfig)
        private readonly currencyConfigRepository: Repository<CurrencyConfig>,
    ) {
    }

    async listCurrencyConfig() {
        const currencyConfigs = await this.dataSource
            .createQueryBuilder(CurrencyConfig, "currency_config")
            .leftJoin(CurrencyToken, "currency_token", "currency_config.chain_id = currency_token.chain_id")
            .select(`
            currency_config.swap_id as swapId, currency_config.network as network,
            currency_config.chain_id as chainId, currency_config.chain_name as chainName,
            currency_config.token_addresses as tokenAddresses, currency_config.average_block_time as averageBlockTime,
            currency_config.required_confirmations as requiredConfirmations, currency_config.temp_required_confirmations as tempRequiredConfirmations,
            currency_config.scan_api as scanApi, currency_config.rpc_endpoint as rpcEndpoint,
            currency_config.explorer_endpoint as explorerEndpoint, currency_config.created_at as createdAt,
            currency_config.updated_at as updatedAt, currency_token.token_name as tokenName,
            currency_token.icon as tokenIcon, currency_token.currency as tokenCurrency`)
            .where(`currency_token.is_native_token = 1 and status = 1`)
            .execute();

        return currencyConfigs;
    }
}