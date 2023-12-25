import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {DtoCauses} from "../../../config/exception/dtoCauses";

export class Create {

    @ApiProperty({
        type: Number,
        example: 0
    })
    @IsNotEmpty({message: JSON.stringify(DtoCauses.NOTI_ID_EMPTY)})
    id: number;

    @ApiProperty({
        type: String,
        example: 'from_user'
    })
    @IsString({message: JSON.stringify(DtoCauses.FROM_USER_STRING)})
    fromUser: string;

    @ApiProperty({
        type: String,
        example: 'to_user'
    })
    @IsString({message: JSON.stringify(DtoCauses.TO_USER_STRING)})
    toUser: string;

    @ApiProperty({
        type: String,
        example: 'data'
    })
    @IsString({message: JSON.stringify(DtoCauses.DATA_STRING)})
    data: string;

    @ApiProperty({
        type: String,
        example: 'type'
    })
    @IsString({message: JSON.stringify(DtoCauses.TYPE_STRING)})
    type: string;

    @ApiProperty({
        type: Boolean,
        example: 'is_read'
    })
    @IsString({message: JSON.stringify(DtoCauses.IS_READ_STRING)})
    isRead: boolean;

    @ApiProperty({
        type: Number,
        example: 'collection_id'
    })
    @IsString({message: JSON.stringify(DtoCauses.COLLECTION_ID_STRING)})
    collectionId: number;

    @ApiProperty({
        type: Number,
        example: 'nft_id'
    })
    @IsNumber({}, {message: JSON.stringify(DtoCauses.NFT_ID_IS_NUMBER)})
    nftId: number;

    
}