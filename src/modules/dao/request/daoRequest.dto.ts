import {ApiProperty} from "@nestjs/swagger";
import {IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiCauses} from "../../../config/exception/apiCauses";
import {Transform, Type} from "class-transformer";

export class SocialDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  origin: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  url: string;
}
export class createDaoRequestDto {
  @ApiProperty({
    type: "string",
    example: "daoName",
  })
  @IsString({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsNotEmpty({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsOptional()
  daoName: string;

  @ApiProperty({
    type: "string",
    example: "daoDescription",
    required: false,
  })
  @IsString({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsNotEmpty({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsOptional()
  daoDescription: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    required: false,
  })
  @IsOptional()
  logo: Express.Multer.File;

  @ApiProperty({
    type: "number",
    example: 1,
    required: true,
  })
  @IsNumber({}, { message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @Transform(({ value }) => Number(value))
  governorId: number;

  @ApiProperty({
    type: "string",
    required: false,
    description: "JSON.stringify(social lists)",
  })
  @IsString({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsOptional()
  social: string;
}

export class exploreDao{
    @ApiProperty({
        type: 'number',
        example: 1,
        required: true
    })
    @IsNumber({}, {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @Transform(({value}) => Number(value))
    daoId: number;
}

export class delegateDao {
  @ApiProperty({
    type: "number",
    example: 1,
    required: true,
  })
  @IsNumber({}, { message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @Transform(({ value }) => Number(value))
  daoId: number;

  @ApiProperty({
    type: "string",
    example: "0x0000000000000000000000000000000000e5c045",
    required: true,
  })
  @IsString({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsNotEmpty({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  toAddress: string;

  @ApiProperty({
    type: "string",
    example: 1,
    required: true,
  })
  @IsString({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsNotEmpty({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  balance: string;
}

export class createProfileDto {
  @ApiProperty({
    type: "number",
    example: 1,
    required: true,
  })
  @IsNumber({}, { message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @Transform(({ value }) => Number(value))
  daoId: number;

  @ApiProperty({
    type: "string",
    example: "No bio provided",
    required: false,
  })
  @IsString({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsNotEmpty({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsOptional()
  bio: string;

  @ApiProperty({
    type: "string",
    example: "",
    required: false,
  })
  @IsString({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  @IsNotEmpty({ message: JSON.stringify(ApiCauses.INTERNAL_ERROR) })
  fullStatement: string;
}

export class createTypeTreasuryDto{

    @ApiProperty({
        type: 'string',
        example: 'typeName'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    typeName: string;
}


export class updateTypeTreasuryDto{


    @ApiProperty({
        type: 'number',
        example: 1
    })
    @IsNumber({}, {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @Transform(({value}) => Number(value))
    id: number;


    @ApiProperty({
        type: 'string',
        example: 'typeName'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    typeName: string;
}


export class createTreasuryDto{
  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber({}, {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @Transform(({value}) => Number(value))
  daoId: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber({}, {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @Transform(({value}) => Number(value))
  typeId: number;

  @ApiProperty({

    type: 'string',
    example: 'token'
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
  token: string;


  @ApiProperty({

    type: 'string',
    example: 'tokenId'
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
  tokenId: string;


  @ApiProperty({
    type: 'string',
    example: 'tokenName'
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
  tokenName: string;



}



export class updateTreasuryDto{
  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber({}, {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @Transform(({value}) => Number(value))
  id: number;


  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber({}, {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @Transform(({value}) => Number(value))
  daoId: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber({}, {message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @Transform(({value}) => Number(value))
  typeId: number;

  @ApiProperty({

    type: 'string',
    example: 'token'
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
  token: string;



  @ApiProperty({

    type: 'string',
    example: 'tokenId'
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
  tokenId: string;


  @ApiProperty({
    type: 'string',
    example: 'tokenName'
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
  tokenName: string;
  


}