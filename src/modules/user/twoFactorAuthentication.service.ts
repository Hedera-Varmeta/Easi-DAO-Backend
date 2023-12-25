import {Injectable} from '@nestjs/common';
import {authenticator} from 'otplib';
import {User} from '../../database/entities';
import {UsersService} from './user.service';
import {JwtService} from '@nestjs/jwt';
import {convertToString, encrypt} from '../../shared/Utils';

var limitRequest2faMap = new Map();

@Injectable()
export class TwoFactorAuthenticationService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {
    }
}