import {Module} from "@nestjs/common";
import {MailModule} from "../mail/mail.module";
import {NotificationService} from "./notification.service";
import {AuthModule} from '../admin/auth.module';
import {NotificationController} from "./notification.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Notification, User} from "../../database/entities";
import {JwtModule} from '@nestjs/jwt';
import {AuthService} from '../user/auth.service';
import {SocketService} from '../worker/socket.service';
import {S3Handler} from "../../shared/S3Handler";
import {AddressesModule} from "../addresses/addresses.module";

@Module({
  imports: [
    MailModule,
    AuthModule,
    AddressesModule,
    TypeOrmModule.forFeature([User, Notification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "abcxyz",
    }),
  ],
  providers: [NotificationService, AuthService, SocketService, S3Handler],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
