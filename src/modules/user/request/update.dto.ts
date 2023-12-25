import {ApiProperty} from "@nestjs/swagger";
import {IsString, Matches, MaxLength, MinLength} from "class-validator";

export class Update {
    @ApiProperty({
        type: String,
        example: 'firstName'
    })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    firstName: string;

    @ApiProperty({
        type: String,
        example: 'lastName'
    })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    lastName: string;

    @ApiProperty({
        type: String,
        example: 'phone'
    })
    @IsString()
    @Matches(/^\+[1-9]\d{1,14}$/)
    phone: string;

    @ApiProperty({
        type: String,
        example: 'dateOfBirth'
    })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    dateOfBirth: string;

}