import {AuctionStatus, LootBoxStatus} from '../../shared/enums';
import {Config, User} from '../../database/entities';
import {LatestBlock} from '../../database/entities';
import {Injectable} from '@nestjs/common';
import * as _ from 'lodash';
import {InjectDataSource, InjectRepository} from '@nestjs/typeorm';
import {
    CurrencyConfig,
} from '../../database/entities';
import {getLogger} from '../../shared/logger';
import {DataSource, Repository} from 'typeorm';
import {NotificationService} from '../notification/notification.service';
import {SocketService} from './socket.service';
import {S3Handler} from 'src/shared/S3Handler';
import {KmsService} from "../common/kms.service";
import {AddressesService} from "../addresses/addresses.service";
import {HederaWorkerService} from "./hedera-worker.service";
import {GovernorsWorkerService} from "./governors-worker.service";
import { MembershipWorkerService } from './membership-worker.service';
import { TransferWorkerService } from './transfer-worker.service';
import { TreasuryWorkerService } from './treasury-worker.service';
const logger = getLogger('WorkerManagerService');
var cron = require('node-cron');

@Injectable()
export class WorkerManagerService {

    private _collectionMapping = {}

    constructor(
        private readonly kmsService: KmsService,
        private readonly notificationService: NotificationService,
        private readonly socketService: SocketService,
        private readonly addressesService: AddressesService,
        @InjectDataSource()
        private dataSource: DataSource,
        @InjectRepository(CurrencyConfig)
        private currenciesRepository: Repository<CurrencyConfig>,
        @InjectRepository(LatestBlock)
        private readonly latestBlockRepository: Repository<LatestBlock>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Config)
        private readonly configRepository: Repository<Config>,

        private readonly s3handler: S3Handler
    ) {
        this.init();
    }

    async init() {
        new HederaWorkerService(this.dataSource);
        new GovernorsWorkerService(this.dataSource);
        new MembershipWorkerService(this.dataSource);
        new TransferWorkerService(this.dataSource);
        new TreasuryWorkerService(this.dataSource);
    }

    runWorker(_cb: () => void) {
        try {
            _cb();
        } catch (error) {
            logger.error(error);
        }
    }

}
