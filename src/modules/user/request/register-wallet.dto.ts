import {ApiProperty} from "@nestjs/swagger";
import {IsEmail,IsOptional, IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsNumber} from "class-validator";

export class RegisterWallet {
    @ApiProperty({
        type: String,
        example: 'address'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    address: string;


    @ApiProperty({
        type: String,
        example: 'username'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    @Matches(/^[a-z0-9]+$/i, {message: 'Username invalid'})
    username: string;

    @ApiProperty({
        type: String,
        example: 'signature'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(500)
    signature: string;

}

export class RegisterHederaWallet {

    @ApiProperty({
        type: String,
        example: '0x753ec194be0aa363c923c07d9ddf1b1adc0b9ded6d557b43c85fef0c41aecccc'
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    address: string;

    @ApiProperty({
        type: String,
        example: '0.0.4642363'
    })
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(600)
    accountId: string;


    @ApiProperty({
        type: String,
        example: 'signature'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(500)
    signature: string;


    @ApiProperty({
        type: String,
        example: '302a300506032b6570032100480db1400c7b384901324f5f6fc243c751da264f695abae8a270798c8e7fe7a3'
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(500)
    publicKey: string;


    @ApiProperty({
        type: String,
        example: 'signature message'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(500)
    message: string;

    @ApiProperty({
        type: Number,
        example: 'IsNumber -  1: check signature, 2: no check signature'
    })
    @IsNumber()
    @IsOptional()
    type: number;

}