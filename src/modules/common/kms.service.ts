import * as AWS from 'aws-sdk';
import {DataSource, EntityManager, MoreThan, Repository} from 'typeorm';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectDataSource, InjectRepository} from '@nestjs/typeorm';
import * as crypto from 'crypto';

import {getLogger} from '../../shared/logger';
import {Address, KmsCmk, KmsDataKey} from '../../database/entities';
import {ApiCauses} from '../../config/exception/apiCauses';

import AwaitLock from 'await-lock';
import {AppWallet, BlockfrostProvider} from "@meshsdk/core";

let lock = new AwaitLock();

//TODO: delete dummy data in production
const DUMMY_DATA_KEY = 'crueltycommentshaft';
const ENCRYPT_ALGORITHM = 'aes256';
const logger = getLogger('KMSService');
var count = 0;

@Injectable()
export class KmsService implements OnModuleInit {
    private readonly _blockchainProvider = new BlockfrostProvider(process.env.BLOCKFROST_API_KEY);
    private LOCAL_CACHED_RECORDS: any;
    private awsCredentials = null;

    constructor(
        @InjectRepository(KmsDataKey)
        private kmsDataKeyRepository: Repository<KmsDataKey>,
        @InjectRepository(KmsCmk)
        private kmsCmkRepository: Repository<KmsCmk>,
        @InjectRepository(Address)
        private addressesRepository: Repository<Address>,
        @InjectDataSource()
        private dataSource: DataSource,
    ) {
        this.LOCAL_CACHED_RECORDS = {};
    }

    private static async getAWSCredentials(): Promise<AWS.Credentials> {
        const providers: any[] = [];
        // read from ~/.aws/credentials
        const fileProvider = new AWS.SharedIniFileCredentials({
            profile: process.env.AWS_PROFILE_NAME || 'default',
        });
        providers.push(fileProvider);
        // read from ec2 instance
        const ec2MetadataProvider = new AWS.EC2MetadataCredentials();
        providers.push(ec2MetadataProvider);
        // read from esc instance
        const escMetadataProvider = new AWS.ECSCredentials();
        providers.push(escMetadataProvider);

        const chain = new AWS.CredentialProviderChain(providers);
        // make credentials
        return await chain.resolvePromise();
    }

    onModuleInit() {
        this.setup();
    }

    async _getCachedRecordById(tableName: string, id: string) {
        if (!this.LOCAL_CACHED_RECORDS[tableName]) {
            this.LOCAL_CACHED_RECORDS[tableName] = {};
        }

        if (this.LOCAL_CACHED_RECORDS[tableName][id]) {
            return this.LOCAL_CACHED_RECORDS[tableName][id];
        }

        let record: any;
        if (tableName === 'kms_cmk') {
            record = await this.kmsCmkRepository.findOne({
                where: {
                    id,
                }
            });
        }
        if (tableName === 'kms_data_key') {
            record = await this.kmsDataKeyRepository.findOne({
                where: {
                    id: parseInt(id),
                }
            });
        }

        if (!record) {
            logger.error(`Not found record: table=${tableName}, id=${id}`);
            throw ApiCauses.KMS_CMK_INVALID;
        }

        this.LOCAL_CACHED_RECORDS[tableName][id] = JSON.parse(JSON.stringify(record));
        return this.LOCAL_CACHED_RECORDS[tableName][id];
    }

    // Get details of CMK for provided KeyId
    // async getMasterKey(cmkId: string) {
    //   const kms = await this._getKMSInstanceByKeyId(cmkId);
    //   const result = await kms.describeKey({ KeyId: cmkId }).promise();
    //   return result;
    // }

    // Generate a new random data key with provided KeyId

    async _getKMSInstanceByKeyId(cmkId: string) {
        const cmk = await this._getCachedRecordById('kms_cmk', cmkId);
        if (!this.awsCredentials) {
            this.awsCredentials = await KmsService.getAWSCredentials();
        }
        return new AWS.KMS({
            region: cmk.region,
            credentials: this.awsCredentials,
        });
    }

    // Get plain text data key from encrypted data key

    // Use this practice: https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html
    async generateDataKey(cmkId: string) {
        if (!cmkId) {
            logger.error(`Cannot generate data key with invalid cmk id: ${cmkId}`);
            throw ApiCauses.KMS_CMK_INVALID;
        }

        const kms = await this._getKMSInstanceByKeyId(cmkId);
        const {Plaintext, CiphertextBlob} = await kms
            .generateDataKey({KeyId: cmkId, KeySpec: 'AES_256'})
            .promise();
        return {
            plain: Plaintext.toString('base64'),
            cipher: CiphertextBlob.toString('base64'),
        };
    }

    // Suppose the KeyId that was used to generate the data key is still exists
    async getDataKey(dataKeyId: string) {
        const dataKeyRecord = await this._getCachedRecordById('kms_data_key', dataKeyId);
        const encryptedDataKey = dataKeyRecord.encryptedDataKey;
        const kms = await this._getKMSInstanceByKeyId(dataKeyRecord.cmkId);
        const {Plaintext} = await kms
            .decrypt({CiphertextBlob: Buffer.from(encryptedDataKey, 'base64')})
            .promise();
        return Plaintext.toString('base64');
    }

    // Encrypt arbitrary data, using the data key that is defined in environment variable
    async encrypt(plainText: string, dataKeyId: string) {
        if (typeof plainText !== 'string') {
            throw ApiCauses.ONLY_SUPPORT_STRING;
        }

        let dataKey = DUMMY_DATA_KEY;
        if (dataKeyId && dataKeyId != "") {
            dataKey = await this.getDataKey(dataKeyId);
        } else if (process.env.NODE_ENV.startsWith('prod')) {
            // production environment requires data key id
            throw ApiCauses.KMS_DATA_KEY_NOT_FOUND;
        }
        // The IV is usually passed along with the ciphertext.
        const iv = Buffer.alloc(16, 0); // Initialization vector.
        const key = crypto.scryptSync(Buffer.from(dataKey, 'base64'), 'salt', 32);
        const cipher = crypto.createCipheriv(ENCRYPT_ALGORITHM, key, iv);
        let crypted = cipher.update(plainText, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    // Decrypt data, using the data key that is defined in environment variable
    async decrypt(cipherText: string, dataKeyId: string) {
        let dataKey = DUMMY_DATA_KEY;
        if (dataKeyId && dataKeyId != "") {
            dataKey = await this.getDataKey(dataKeyId);
        } else if (process.env.NODE_ENV.startsWith('prod')) {
            // production environment requires data key id
            throw ApiCauses.KMS_DATA_KEY_NOT_FOUND;
        }
        // The IV is usually passed along with the ciphertext.
        const iv = Buffer.alloc(16, 0); // Initialization vector.
        const key = crypto.scryptSync(Buffer.from(dataKey, 'base64'), 'salt', 32);
        const decipher = crypto.createDecipheriv(ENCRYPT_ALGORITHM, key, iv);
        let decrypted = decipher.update(cipherText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    async _combineData(plainText: string, dataKeyId: string) {
        const dataKey = await this.getDataKey(dataKeyId);
        return `${plainText}:${dataKey}`;
    }

    // Make sure there's always at least 1 record in kms_data_key table
    setup() {
        this._setup().then(async (dataKey) => {
            //NOTE: uncomment and run first time init app
            if (dataKey) {
                const address = await this.getMasterAddress();
                if (!address) {
                    logger.info(`Could not encrypt private key of master wallet.`);
                }
            }
            // logger.info(`Generated master wallet address:: address=${address.address}, note=${address.note}`);
        }).catch((e) => {
            logger.error(`Setup data key failed with error:`);
            logger.error(e);
            // console.log(e);
        });
    }


    async getMasterAddress(): Promise<Address> {
        await lock.acquireAsync();
        try {
            const dataKey = await this.kmsDataKeyRepository.findOne({
                where: {
                    id: MoreThan(0),
                }
            });

            if (!dataKey) {
                logger.warn(`Could not find the kmsDataKey`);
                return;
            }

            let addressRecord: any;

            await this.dataSource.transaction(async (transactional) => {
                addressRecord = await transactional
                    .getRepository(Address)
                    .createQueryBuilder('address')
                    .useTransaction(true)
                    .setLock("pessimistic_write")
                    .where('address.note = :note', {note: "Master_Wallet"})
                    .getOne();

                // address already exists, return true
                if (addressRecord) {
                    return;
                }

                // address not exists, create new address
                addressRecord = await this.createWalletAddress(dataKey, transactional, "Master_Wallet");
            });

            return addressRecord;
        } finally {
            lock.release();
        }
    }


    async createWalletAddress(
        dataKey: KmsDataKey,
        entityManager: EntityManager,
        note: string
    ): Promise<Address> {
        const {address, privateKeyHandled, kmsDataKeyId} = await this.generateOneWalletAddress(
            dataKey,
        );
        const secret = JSON.stringify({
            private_key: privateKeyHandled,
            kms_data_key_id: kmsDataKeyId,
        });
        const addr = this.addressesRepository.create({
            address,
            secret,
            note
        });
        await entityManager.save(addr);

        return addr;
    }

    // Generate a new wallet address without inserting to database yet
    async generateOneWalletAddress(dataKey: KmsDataKey) {
        const mnemonic = AppWallet.brew();
        const wallet = new AppWallet({
            networkId: 0,
            fetcher: this._blockchainProvider,
            submitter: this._blockchainProvider,
            key: {
                type: "mnemonic",
                words: mnemonic,
            }
        });

        let kmsDataKeyId: string;
        let privateKeyHandled: string;

        if (!dataKey?.id) {
            kmsDataKeyId = "";
        } else {
            kmsDataKeyId = dataKey.id.toString();
        }
        privateKeyHandled = await this.encrypt(mnemonic.toString(), kmsDataKeyId);

        return {address: wallet.getPaymentAddress(), privateKeyHandled, kmsDataKeyId};
    }


    async _setup() {
        if (count == 0) {
            count++;
            const existedKey = await this.kmsDataKeyRepository.findOne({
                where: {
                    isEnabled: 1,
                }
            });
            if (existedKey) {
                return existedKey;
            }
            logger.info(`There is no key in database yet. Will try to create a new default one.`);
            const cmk = await this.kmsCmkRepository.findOne({
                where: {
                    isEnabled: true,
                }
            });
            if (!cmk) {
                logger.warn(`Could not find the default CMK`);
                if (process.env.NODE_ENV.startsWith('prod')) {
                    process.exit(1);
                }
                return;
            }

            const newKey = await this.generateDataKey(cmk.id);
            let dataKey = this.kmsDataKeyRepository.create({
                cmkId: cmk.id,
                encryptedDataKey: newKey.cipher,
            });
            dataKey = await this.kmsDataKeyRepository.save(dataKey);
            logger.info(
                `Created new kms data key successfully: id=${dataKey.id}, cmkId=${cmk.id}, encrypted=${newKey.cipher}`,
            );
            return dataKey;
        }
    }

}
