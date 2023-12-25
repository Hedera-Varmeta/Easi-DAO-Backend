import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('governors')
export class Governors {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the governor' })
  public id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, comment: 'Name of the governor' })
  public name: string;

  @Column({ name: 'address', type: 'varchar', nullable: true, comment: 'Wallet address of the governor' })
  public address: string;

  @Column({ name: 'timelock_deterministic', type: 'varchar', nullable: true, comment: 'Timelock deterministic of the governor' }) 
  public timelockDeterministic: string;


  @Column({ name: 'timelock_min_delay', type: 'varchar', nullable: true, comment: 'Timelock deterministic of the governor' }) 
  public timelockMinDelay: string;

  @Column({ name: 'vote_token', type: 'varchar', nullable: true, comment: 'Vote token of the governor' })
  public voteToken: string;


  @Column({ name: 'predict_treasury', type: 'varchar', nullable: true, comment: 'Wallet address of the governor' })
  public predictTreasury: string;

  @Column({ name: 'role', type: 'varchar', nullable: true, comment: 'Role of the governor in the DAO' })
  public role: string;


  @Column({ name: 'type_id', nullable: false, comment: 'Foreign key referencing Governors' })
  public typeId: number;

  @Column({ name: 'setting_id', nullable: false, comment: 'Foreign key referencing GovernorsSetting' })
  public settingId: number;


  @Column({ name: 'block_number', nullable: true })
  public blockNumber: number;


  @Column({name: 'status', type: 'tinyint', width: 1, nullable: false, default: 1})
  public status: boolean;


  @Column({name: 'is_crawl', type: 'tinyint', width: 1, nullable: false, default: 0})
  public isCrawl: boolean;

  @Column({ name: 'contract_id', type: 'varchar', nullable: true})
  public contractId: string;



  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the governor was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the governor was last updated' })
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
