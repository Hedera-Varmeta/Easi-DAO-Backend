import {BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';
import {nowInMillis} from '../../shared/Utils';

@Entity('user')
@Index('username', ['username'], {unique: true})
@Index('wallet', ['wallet'], {unique: true})
@Index('status', ['status'], {unique: false})
@Index('type', ['type'], {unique: false})
export class User {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    public id: number;

    @Column({name: 'username', type: 'varchar', length: 80, nullable: true, unique: true})
    public username: string;

    @Column({name: 'avatar_url', type: 'varchar', length: 255, nullable: true})
    public avatarUrl: string;

    @Column({name: 'first_name', type: 'varchar', length: 100, nullable: true})
    public firstName: string;

    @Column({name: 'last_name', type: 'varchar', length: 100, nullable: true})
    public lastName: string;

    @Column({name: 'date_of_birth', type: 'date', nullable: true})
    public dateOfBirth: Date;

    @Column({name: 'phone', type: 'varchar', length: 15, nullable: true})
    public phone: string;

    @Column({name: 'created_at', type: 'bigint', nullable: true})
    public createdAt: number;

    @Column({name: 'updated_at', type: 'bigint', nullable: true})
    public updatedAt: number;


    @Column({name: 'wallet', type: 'varchar', length: 255, nullable: true})
    public wallet: string;


    @Column({name: 'account_id', type: 'varchar', length: 255, nullable: true})
    public accountId: string;


    @Column({name: 'status', type: 'varchar', length: 25, nullable: true, default: 'request'})
    public status: string;

    @Column({name: 'type', type: 'varchar', length: 25, nullable: true})
    public type: string;

    @Column({name: 'token', type: 'varchar', length: 255, nullable: true})
    public token: string;

    @BeforeInsert()
    public updateCreateDates() {
        this.createdAt = nowInMillis();
        this.updatedAt = nowInMillis();
    }

    @BeforeUpdate()
    public updateUpdateDates() {
        this.updatedAt = nowInMillis();
    }
}
