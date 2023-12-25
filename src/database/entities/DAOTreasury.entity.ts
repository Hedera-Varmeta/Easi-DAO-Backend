import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('dao_treasury')
export class DAOTreasury {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the DAO treasury' })
  public id: number;

  @Column({ name: 'dao_id', type: 'bigint', nullable: false, comment: 'ID of the DAO' })
  public daoId: number;

  @Column({ name: 'token', type: 'varchar', nullable: true, comment: 'Wallet address of the governor' })
  public token: string;

  @Column({ name: 'token_id', type: 'varchar', nullable: true, comment: 'Wallet address of the governor' })
  public tokenId: string;


  @Column({ name: 'token_name', type: 'varchar', nullable: true, comment: 'Asset held in the treasury' })
  public tokenName: string;

  @Column({ name: 'type_id', type: 'bigint', nullable: true, default: 0 })
  public typeId: number;


  @Column({name: 'is_crawl', type: 'tinyint', width: 1, nullable: false, default: 0})
  public isCrawl: boolean;

  
  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO treasury was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO treasury was last updated' })
  public updatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    const timestamp = nowInMillis();
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = nowInMillis();
  }
}
 