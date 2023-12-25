import {ApiProperty} from "@nestjs/swagger";
import {IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiCauses} from "../../../config/exception/apiCauses";

export class createGovernorsRequestDto {
    @ApiProperty({
        type: 'string',
        example: 'governorName'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    name: string;

    @ApiProperty({
        type: 'string',
        example: 'governorAddress',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    address: string;


    @ApiProperty({
        type: 'string',
        example: '123456789',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    timelockDeterministic: string;



    @ApiProperty({
        type: 'string',
        example: '123456789',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    timelockMinDelay: string;



    @ApiProperty({
        type: 'string',
        example: '0x123456789',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    voteToken: string;

    @ApiProperty({
        type: 'string',
        example: 'governorRole',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    role: string;

    @ApiProperty({
        type: 'number',
        example: 'governorSettingId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    settingId: number;


    @ApiProperty({
        type: 'number',
        example: 'governorTypeId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    typeId: number;


    @ApiProperty({
        type: 'string',
        example: '0x123456789',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    contractId: string;


    @ApiProperty({
        type: 'string',
        example: 'predictTreasury',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    predictTreasury: string;

}


export class createGovernorsTypeRequestDto {
    @ApiProperty({
        type: 'string',
        example: 'governorTypeName'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    typeName: string;

    @ApiProperty({
        type: 'string',
        example: 'governorTypeDescription',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    typeDescription: string;

    @ApiProperty({
        type: 'string',
        example: 'active-inactive',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsIn(['active', 'inactive'], {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    typeStatus: string;
}


export class createGovernorsSettingRequestDto {
    
    @ApiProperty({
        type: 'string',
        example: 'governorSettingName'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    settingName: string;

    @ApiProperty({
        type: 'string',
        example: 'governorSettingDescription',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    settingDescription: string;


    @ApiProperty({
        type: 'number',
        example: 'governorTypeId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    typeId: number;

}


export class createGovernorsSettingFieldRequestDto {
    @ApiProperty({
        type: 'string',
        example: 'fieldName'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldName: string;

    @ApiProperty({
        type: 'string',
        example: 'fieldValue',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldValue: string;


    @ApiProperty({
        type: 'string',
        example: 'fieldDescription',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldDescription: string;

    @ApiProperty({
        type: 'number',
        example: 'governorSettingId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    settingId: number;

    @ApiProperty({
        type: 'string',
        example: 'fieldPlaceholder',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldPlaceholder: string;

}



export class createGovernorsSettingValueRequestDto {
    @ApiProperty({
        type: 'string',
        example: 'fieldValue'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    fieldValue: string;

    @ApiProperty({
        type: 'number',
        example: 'fieldId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldId: number;

    @ApiProperty({
        type: 'number',
        example: 'governorId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    governorId: number;

}



export class createGovernorsVoteFieldRequestDto {
    @ApiProperty({
        type: 'string',
        example: 'fieldName'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldName: string;

    @ApiProperty({
        type: 'string',
        example: 'fieldValue',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldValue: string;


    @ApiProperty({
        type: 'string',
        example: 'fieldDescription',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldDescription: string;

    @ApiProperty({
        type: 'number',
        example: 'governorSettingId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    settingId: number;

}



export class createGovernorsVoteValueRequestDto {
    @ApiProperty({
        type: 'string',
        example: 'fieldValue'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    fieldValue: string;

    @ApiProperty({
        type: 'number',
        example: 'fieldId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    fieldId: number;


    @ApiProperty({
        type: 'number',
        example: 'governorId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    governorId: number;

}

