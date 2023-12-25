import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {DtoCauses} from "../../../config/exception/dtoCauses";


export class Update {
    @ApiProperty({
        type: Number,
        example: 0
    })
    @IsNotEmpty({message: JSON.stringify(DtoCauses.NOTI_ID_EMPTY)})
    id: number;

}