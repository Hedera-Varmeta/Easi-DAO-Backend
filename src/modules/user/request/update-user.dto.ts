import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateUser {


    @ApiProperty({
        type: String,
        example: 'xxxxx'
    })
    @IsString()
    vendorName: string;


    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    id: number;


    @ApiProperty({
        type: String,
        example: '[123123123,....]'
    })
    @IsString()
    brandIds: string;

}


export class updateInfo{
    @ApiProperty({
        type: String,
        example: 'firstName'
    })
    @IsString()
    @IsOptional()
    firstName: string;

    @ApiProperty({
        type: String,
        example: 'lastName'
    })  
    @IsString() 
    @IsOptional()
    lastName: string;

    @ApiProperty({
        type: String,
        example: 'phone'
    })  
    @IsString()
    @IsOptional()
    phone: string;

    @ApiProperty({
        type: String,
        example: 'avatarUrl'
    })
    @IsString()
    @IsOptional()
    avatarUrl: string;

    @ApiProperty({
        type: "string",
        format: "binary",
        required: false
    })
    @IsOptional()
    image: any;


    @ApiProperty({
        type: String,
        example: 'dateOfBirth'
    })
    @IsString()
    @IsOptional()
    dateOfBirth: string;

}