import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Address, Admin, Config, KmsDataKey, User} from '../../database/entities';
import {AddressesController} from './addresses.controller';
import {AddressesService} from './addresses.service';
import {CommonModule} from '../common/common.module';
import {JwtModule} from '@nestjs/jwt';
import {AuthService} from "../admin/auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([KmsDataKey, Address, Config]),
        CommonModule,
        TypeOrmModule.forFeature([User, Admin]),
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'abcxyz',
        }),
    ],
    controllers: [AddressesController],
    exports: [TypeOrmModule, AddressesService],
    providers: [AddressesService, AuthService],
})
export class AddressesModule {
}
