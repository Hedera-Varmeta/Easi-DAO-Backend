import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Admin} from "../../database/entities";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthService} from "./auth.service";
import {Module} from "@nestjs/common";
import {S3Handler} from "../../shared/S3Handler";
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";
import {MailService} from "../mail/mail.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'abcxyz',
            // signOptions: { expiresIn: 24 * 60 * 60 },
        })],
    providers: [AuthService, S3Handler, JwtStrategy, MailService],
    controllers: [AuthController],
})
export class AuthModule {
}