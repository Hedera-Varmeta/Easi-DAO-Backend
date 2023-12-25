import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from 'class-validator';
import {DtoCauses} from "../../../config/exception/dtoCauses";

export class AdminResetPassword {
    @ApiProperty({
        type: String,
        example: 'ntuquynhhong@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail({}, {message: JSON.stringify(DtoCauses.EMAIL_INVALID)})
    email: string;
}