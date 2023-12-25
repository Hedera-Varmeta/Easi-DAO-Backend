import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";
import {DtoCauses} from "../../../config/exception/dtoCauses";


export class CreateNoti {
    @ApiProperty({
        type: String,
        example: 'subject'
    })
    @IsString()
    subject: string;

    @ApiProperty({
        type: String,
        example: 'content'
    })
    @IsString()
    content: string;

    @ApiProperty({
        type: String,
        example: 'link_view'
    })
    @IsString()
    linkView: string;

    @ApiProperty({
        type: Number,
        example: 'status'
    })
    @IsNumber({}, {message: JSON.stringify(DtoCauses.STATUS_NUMBER)})
    status: number;

    @ApiProperty({
        type: Number,
        example: 'sending_time'
    })
    @IsString()
    sendingTime: number;


    
}