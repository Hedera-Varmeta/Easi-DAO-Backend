import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from 'class-validator';

export class Login {
    @ApiProperty({
        type: String,
        example: 'example@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        example: 'password'
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        type: String,
        example: '123456'
    })
    twofa: string;

    @ApiProperty({
        type: String,
        example: '123456'
    })
    emailCode: string;
}