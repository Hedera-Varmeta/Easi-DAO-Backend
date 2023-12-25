import {Body, Controller, Get, HttpStatus, Post, Req, UseGuards} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiCauses} from "../../config/exception/apiCauses";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {AdminLogin} from "./request/login.dto";
import * as argon2 from "argon2";
import {EmptyObjectBase} from "../../shared/response/emptyObjectBase.dto";
import {EmptyObject} from "../../shared/response/emptyObject.dto";
import RequestWithUser from "./requestWithUser.interface";
import {UpdatePassword} from "./request/update-password.dto";
import {MailService} from "../mail/mail.service";
import {AdminResetPassword} from "./request/reset-password.dto";
import {notifyNewPassword} from "../../shared/emailTemplate";

@Controller("admin")
export class AuthController {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private mailService: MailService
    ) {
    }

    // api logic
    @Post("/login")
    @ApiOperation({
        tags: ["admin"],
        operationId: "logout",
        summary: "Login",
        description: "Login",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Login failed",
        type: EmptyObjectBase,
    })
    async login(
        @Body() data: AdminLogin
    ) {
        const user = await this.authService.validateAdmin(data);

        if (!user) {
            throw ApiCauses.NON_RECORDED_USERNAME;
        }

        if (await argon2.verify(user.password, data.password)) {
            return this.authService.login(user);
        } else {
            throw ApiCauses.PASSWORD_IS_FALSE;
        }
    }

    @Post("/logout")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        tags: ["admin"],
        operationId: "logout",
        summary: "Logout",
        description: "Logout",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successful",
        type: EmptyObjectBase,
    })
    async logout(@Req() request: RequestWithUser): Promise<EmptyObject> {
        if (!request || !request.user) throw ApiCauses.USER_DONT_HAVE_PERMISSION;

        const token = request.headers.authorization;
        await this.authService.logout(token);
        return new EmptyObject();
    }

    // api update password
    @Post("/update-password")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        tags: ["admin"],
        operationId: "updatePassword",
        summary: "Update password",
        description: "Update password",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successful",
        type: EmptyObjectBase,
    })
    async updatePassword(
        @Req() request: RequestWithUser,
        @Body() data: UpdatePassword
    ): Promise<any> {
        if (!request || !request.user) throw ApiCauses.USER_DONT_HAVE_PERMISSION;

        if (data.oldPassword === data.newPassword) throw ApiCauses.DUPLICATE_PASSWORD;

        const user = request.user;
        const userUpdate = await this.authService.updatePassword(user, data);

        if (!userUpdate) throw ApiCauses.DATA_INVALID;

        return userUpdate;
    }


    @Get("/me")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        tags: ["admin"],
        operationId: "me",
        summary: "Get user info",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successful",
        type: EmptyObjectBase,
    })
    async me(@Req() request: RequestWithUser): Promise<any> {
        if (!request || !request.user) throw ApiCauses.USER_DONT_HAVE_PERMISSION;

        const user = request.user;
        delete user.password;
        return user;
    }

    @Post("/reset-password")
    @ApiOperation({
        tags: ["admin"],
        operationId: "reset password",
        summary: "Reset password",
        description: "Send email for new password",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Login failed",
        type: EmptyObjectBase,
    })
    async resetPassword(
        @Body() data: AdminResetPassword
    ) {
        const newPassword = this.authService.createNewRandomPassword()
        const admin = await this.authService.getUserByEmail(data.email);
        if (!admin) throw ApiCauses.DATA_INVALID

        const adminAfterResetPassword = await this.authService.resetPassword(admin, newPassword)
        await this.mailService.sendMail(data.email, 'Password reseted', notifyNewPassword({username: admin.fullName}, newPassword))
        return adminAfterResetPassword;
    }
}