import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserAdminController} from './user.admin.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './jwt.strategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Admin, Governors, User} from '../../database/entities';
import {TwoFactorAuthenticationService} from './twoFactorAuthentication.service';
import {UsersService} from './user.service';
import {MailModule} from '../mail/mail.module';
import {AddressesModule} from '../addresses/addresses.module';
import {AddressesService} from '../addresses/addresses.service';
import {CommonModule} from '../common/common.module';
import {AuthService as AuthAdminService} from '../admin/auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Admin,Governors]),
        PassportModule,
        MailModule,
        AddressesModule,
        CommonModule,
        AddressesModule,
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'abcxyz',
        }),
    ],
    providers: [AuthService, AuthAdminService, JwtStrategy, TwoFactorAuthenticationService, UsersService, AddressesService],
    controllers: [AuthController, UserAdminController],
})
export class AuthUserModule {
}
