import {Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {ApiCauses} from '../../config/exception/apiCauses';
import {JwtAuthGuard} from '../admin/jwt-auth.guard';
import {RegisterBase} from './response/registerBase.dto';
import {TwoFactorAuthenticationService} from './twoFactorAuthentication.service';
import {UsersService} from './user.service';
import {JwtService} from '@nestjs/jwt';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {User} from '../../database/entities';
import {AuthService as AuthServiceAdmin} from '../admin/auth.service';

const Web3 = require("web3");

@Controller('admin-user')
export class UserAdminController {
    _web3 = new Web3();

    constructor(
        private jwtService: JwtService,
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
        private readonly usersService: UsersService,
        private authService: AuthService,
        private authServiceAdmin: AuthServiceAdmin,
    ) {
    }


    @Get('user/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        tags: ['admin-user'],
        operationId: 'info user',
        summary: 'info user',
        description: 'Info user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successful',
        type: User,
    })
    async getInfoUser(@Param('id') id: number, @Req() request: any) {
        if (!request || !request.user) throw ApiCauses.USER_NOT_ACCESS;
    
        const user = await this.authService.getDetailUser(id);
        if (!user) throw ApiCauses.DATA_INVALID;
        return user;
    }


    @Get('detail-user/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        tags: ['admin-user'],
        operationId: 'info user',
        summary: 'info user',
        description: 'Info user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successful',
        type: User,
    })
    async getDetailUser(@Param('id') id: number, @Req() request: any) {
        if (!request || !request.user) throw ApiCauses.USER_NOT_ACCESS;
     
        const user = await this.authService.getDetailUser(id);
        if (!user) throw ApiCauses.DATA_INVALID;
        return user;
    }
}
