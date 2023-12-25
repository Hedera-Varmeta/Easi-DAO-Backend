import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";
import {DtoCauses} from "../../../config/exception/dtoCauses";

export class UpdatePassword {
    @ApiProperty({
        type: String,
        example: 'password'
    })
    @IsNotEmpty()
    @IsNotEmpty({message: JSON.stringify(DtoCauses.PASSWORD_EMPTY)})
    @IsString({message: JSON.stringify(DtoCauses.PASSWORD_STRING)})
    @MinLength(8, {message: JSON.stringify(DtoCauses.PASSWORD_MIN_LENGTH)})
    @MaxLength(20, {message: JSON.stringify(DtoCauses.PASSWORD_MAX_LENGTH)})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: JSON.stringify(DtoCauses.PASSWORD_MATCH_PATTERN)})
    oldPassword: string;

    @ApiProperty({
        type: String,
        example: 'password'
    })
    @IsNotEmpty()
    @IsNotEmpty({message: JSON.stringify(DtoCauses.PASSWORD_EMPTY)})
    @IsString({message: JSON.stringify(DtoCauses.PASSWORD_STRING)})
    @MinLength(8, {message: JSON.stringify(DtoCauses.PASSWORD_MIN_LENGTH)})
    @MaxLength(20, {message: JSON.stringify(DtoCauses.PASSWORD_MAX_LENGTH)})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: JSON.stringify(DtoCauses.PASSWORD_MATCH_PATTERN)})
    newPassword: string;

}