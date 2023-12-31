import {Body, Controller, Get, HttpStatus, Post, Req, UseGuards, UsePipes} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Notification} from '../../database/entities';
import {ApiCauses} from '../../config/exception/apiCauses';
import {JwtAuthGuard} from '../user/jwt-auth.guard';
import {TrimPipe} from 'src/shared/TrimPipe';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
    ) {}

  @Get('total-not-read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['notification'],
    operationId: 'getList',
    summary: 'Get all collection',
    description: 'Get all collection',
  })
  @UsePipes(new TrimPipe())
  async getTotalNotReadNotification(@Req() request: any): Promise<Notification[]> {
    if (!request || !request.user || !request.user.id || !request.user.username) throw ApiCauses.USER_NOT_ACCESS;
    return this.notificationService.getTotalNotReadNotification(request.user);
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
      tags: ['notification'],
      operationId: 'update notification',
      summary: 'update notification',
      description: 'update a new notification',
  })
  @ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful',
  })
  async update(@Body() data: any, @Req() request: any) {
    const notification = await this.notificationService.update(data, request.user);

    return notification;
  }
}
