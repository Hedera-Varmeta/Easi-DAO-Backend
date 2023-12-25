import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {
    Address,
    Admin,
    CurrencyConfig,
    KmsCmk,
    KmsDataKey, LatestBlock,
} from "../../database/entities";
import {WorkerManagerService} from "./worker-manager.service";
import {CommonModule} from "../common/common.module";
import {MailModule} from "../mail/mail.module";
import {NotificationModule} from "../notification/notification.module";
import {SocketService} from "./socket.service";
import {AddressesModule} from "../addresses/addresses.module";
import {S3Handler} from "../../shared/S3Handler";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Admin,
            KmsCmk,
            Address,
            KmsDataKey,
            CurrencyConfig,
            LatestBlock
        ]),
        CommonModule,
        AddressesModule,
        MailModule,
        NotificationModule
    ],
    controllers: [],
    exports: [TypeOrmModule],
    providers: [WorkerManagerService, SocketService, S3Handler]
})
export class WorkerModule {
}