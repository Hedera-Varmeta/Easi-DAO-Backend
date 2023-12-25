import {ApiProperty} from "@nestjs/swagger";
import {IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiCauses} from "../../../config/exception/apiCauses";
import {Transform, Type} from "class-transformer";

export class createProposalRequestDto { 
    @ApiProperty({
        type: 'string',
        example: 'proposalTitle'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalTitle: string;


    @ApiProperty({
        type: 'string',
        example: 'proposalDescription',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalDescription: string;



    @ApiProperty({
        type: 'string',
        example: 'proposalId',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalId: string;


    @ApiProperty({
        type: 'string',
        example: 'proposalStatus',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalStatus: string;

    @ApiProperty({
        type: 'number',
        example: 1,
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    @Type(() => Number)
    daoId: number;
    

    @ApiProperty({
        type: 'number',
        example: 1,
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalVotesId: number;



    @ApiProperty({
        type: 'number',
        example: 1,
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalSnapshot: number;
   
    

    @ApiProperty({
        type: 'number',
        example: 1,
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalDeadline: number;

    @ApiProperty({
        type: 'string',
        example: 'calldatas',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    calldatas: string;


    @ApiProperty({
        type: 'string',
        example: 'actionName',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    actionName: string;


    @ApiProperty({
        type: 'string',
        example: 'encodeData',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    encodeData: string;


    @ApiProperty({
        type: 'string',
        example: 'values',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    values: string;


    @ApiProperty({
        type: 'string',
        example: 'addressArr',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    addressArr: string;


    @ApiProperty({
        type: 'string',
        example: 'valueArr',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    valueArr: string;


    @ApiProperty({
        type: 'string',
        example: 'encodeArr',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    encodeArr: string;


    @ApiProperty({
        type: 'string',
        example: 'data',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    data: string;

}


export class createVoteOption {
    @ApiProperty({
        type: 'string',
        example: 'name'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    name: string;


    @ApiProperty({
        type: 'string',
        example: 'description',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    description: string;
    



    @ApiProperty({
        type: 'number',
        example: 'voteId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    voteId: number;

}


export class createVoteRequestDto {
    @ApiProperty({
        type: 'string',
        example: 'name'
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    name: string;


    @ApiProperty({
        type: 'string',
        example: 'description',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    description: string;

}



export class createVoteProposalRequestDto {
    @ApiProperty({
        type: 'number',
        example: 'voteId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    voteId: number;


    @ApiProperty({
        type: 'number',
        example: 'proposalId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    proposalId: number;

    @ApiProperty({
        type: 'number',
        example: 'voteOptionId',
        required: false
    })
    @IsNumber({},{message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    voteOptionId: number;
  
    @ApiProperty({
      type: 'string',
      example: 'voteBalance',
      required: false
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
    voteBalance: string;
  
    @ApiProperty({
      type: 'string',
      example: 'votePower',
      required: false
  })
  @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
  @IsOptional()
  votePower: string;

    @ApiProperty({
        type: 'string',
        example: 'comment',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    voteComment: string;


    @ApiProperty({
        type: 'string',
        example: 'voteAddress',
        required: false
    })
    @IsString({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsNotEmpty({message: JSON.stringify(ApiCauses.INTERNAL_ERROR)})
    @IsOptional()
    voteAddress: string;
}