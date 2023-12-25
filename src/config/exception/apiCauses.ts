import {HttpStatus} from '@nestjs/common';
import {JsonException} from './exception.dto';

export class ApiCauses {
    public static INTERNAL_ERROR = new JsonException(
        'Server internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_ERROR'
    );

    public static NO_CHANGE_PASS = new JsonException(
        'No change password',
        HttpStatus.BAD_REQUEST,
        'NO_CHANGE_PASS'
    );

    public static ERROR_IPFS = new JsonException(
        ['Ipfs Error due to running out of space or key.'],
        HttpStatus.BAD_REQUEST,
        'ERROR_IPFS'
    );



    public static TREASURY_EXIST = new JsonException(
        'Treasury exist',
        HttpStatus.BAD_REQUEST,
        'TREASURY_EXIST'
    );

    public static NO_USER_BY_WALLET = new JsonException(
        'No user by wallet',
        HttpStatus.BAD_REQUEST,
        'NO_USER_BY_WALLET'
    );

    public static USER_IS_BLACKLIST = new JsonException(
        'User is blacklist',
        HttpStatus.BAD_REQUEST,
        'USER_IS_BLACKLIST'
    );

    public static USER_NOT_ACCESS = new JsonException(
        'User not access',
        HttpStatus.UNAUTHORIZED,
        'USER_NOT_ACCESS'
    );

    public static USER_ERROR = new JsonException(
        'User error',
        HttpStatus.BAD_REQUEST,
        'USER_ERROR'
    );

    public static EMAIL_OR_PASSWORD_INVALID = new JsonException(
        'Email or password invalid',
        HttpStatus.BAD_REQUEST,
        'EMAIL_OR_PASSWORD_INVALID'
    );

    public static PHONE_INVALID = new JsonException(
        'Phone invalid',
        HttpStatus.BAD_REQUEST,
        'PHONE_INVALID'
    );

    public static EMAIL_CODE_INVALID = new JsonException(
        'Email code invalid',
        HttpStatus.BAD_REQUEST,
        'EMAIL_CODE_INVALID'
    );

    public static USER_IN_BLACKLIST = new JsonException(
        'User in blacklist',
        HttpStatus.BAD_REQUEST,
        'USER_IN_BLACKLIST'
    );

    public static INVALID_SIGNATURE_WALLET = new JsonException(
        'Invalid signature wallet',
        HttpStatus.BAD_REQUEST,
        'INVALID_SIGNATURE_WALLET'
    );

    public static TWOFA_INVALID = new JsonException(
        'Two factor authentication invalid',
        HttpStatus.BAD_REQUEST,
        'TWOFA_INVALID'
    );

    public static DUPLICATED_EMAIL_OR_USERNAME = new JsonException(
        'Duplicated email or username',
        HttpStatus.BAD_REQUEST,
        'DUPLICATED_EMAIL_OR_USERNAME'
    );

    public static DUPLICATED_WALLET = new JsonException(
        'Duplicated wallet or username',
        HttpStatus.BAD_REQUEST,
        'DUPLICATED_WALLET'
    );

    public static BLOCKCHAIN_IS_NOT_STARTED = new JsonException(
        `blockchain service is not started yet...`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'BLOCKCHAIN_IS_NOT_STARTED'
    );

    public static JWT_EXPIRED = new JsonException(
        'JWT expired',
        HttpStatus.UNAUTHORIZED,
        'JWT_EXPIRED'
    );

    public static FILE_SIZE_OVER = new JsonException(
        'File size over',
        HttpStatus.BAD_REQUEST,
        'FILE_SIZE_OVER'
    );

    public static FILE_TYPE_INVALID = new JsonException(
        'File type invalid',
        HttpStatus.BAD_REQUEST,
        'FILE_TYPE_INVALID'
    );

    public static NON_RECORDED_USERNAME = new JsonException(
        'This user is not recorded.',
        HttpStatus.UNAUTHORIZED,
        'NON_RECORDED_USERNAME'
    );

    public static PASSWORD_IS_FALSE = new JsonException(
        "The password you entered didn't match our record",
        HttpStatus.BAD_REQUEST,
        'PASSWORD_IS_FALSE'
    );

    public static USER_DONT_HAVE_PERMISSION = new JsonException(
        "You don't have permission to access",
        HttpStatus.UNAUTHORIZED,
        'USER_DONT_HAVE_PERMISSION'
    );

    public static DATA_INVALID = new JsonException(
        "Data invalid",
        HttpStatus.BAD_REQUEST,
        'DATA_INVALID'
    );

    public static DUPLICATE_PASSWORD = new JsonException(
        'The new password cannot be the same as the old password',
        HttpStatus.BAD_REQUEST,
        'DUPLICATE_PASSWORD'
    );

    public static SCHEDULE_FILE_NOT_FOUND = new JsonException(
        'Schedule file not found',
        HttpStatus.BAD_REQUEST,
        'SCHEDULE_FILE_NOT_FOUND'
    );

    public static SCHEDULE_NOT_FOUND = new JsonException(
        'Schedule not found',
        HttpStatus.BAD_REQUEST,
        'SCHEDULE_NOT_FOUND'
    );

    public static KMS_CMK_INVALID = new JsonException(
        'KMS CMK invalid',
        HttpStatus.BAD_REQUEST,
        'KMS_CMK_INVALID'
    );

    public static ONLY_SUPPORT_STRING = new JsonException(
        'Only support string',
        HttpStatus.BAD_REQUEST,
        'ONLY_SUPPORT_STRING'
    );

    public static KMS_DATA_KEY_NOT_FOUND = new JsonException(
        'msg_kms_data_key_not_found',
        HttpStatus.NOT_FOUND, 'KMS_DATA_KEY_NOT_FOUND',
    );

    public static WALLET_WITH_CURRENCY_NOT_CREATED = new JsonException(
        'Wallet with currency not created',
        HttpStatus.BAD_REQUEST,
        'WALLET_WITH_CURRENCY_NOT_CREATED'
    );

    public static ENCRYPT_PRIVATE_KEY_ERROR = new JsonException(
        'Encrypt private key error',
        HttpStatus.BAD_REQUEST,
        'ENCRYPT_PRIVATE_KEY_ERROR'
    );
}