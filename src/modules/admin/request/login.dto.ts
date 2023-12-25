import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {DtoCauses} from "../../../config/exception/dtoCauses";

export class AdminLogin {
    @ApiProperty({
        type: String,
        example: 'nhatnt'
    })
    @IsOptional()
    @IsString({message: JSON.stringify(DtoCauses.USERNAME_STRING)})
    username: string;

    @ApiProperty({
        type: String,
        example: 'nhat.bka.64@gmail.com'
    })
    @IsOptional()
    @IsEmail({}, {message: JSON.stringify(DtoCauses.EMAIL_INVALID)})
    email: string;

    @ApiProperty({
        type: String,
        example: 'Nhat@nt123'
    })
    @IsNotEmpty({message: JSON.stringify(DtoCauses.PASSWORD_EMPTY)})
    password: string;
}