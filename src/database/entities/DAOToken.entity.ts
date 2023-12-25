import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('dao_token')
export class DAOToken {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the DAO token' })
  public id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, comment: 'Name of the DAO token' })
  public name: string;

  @Column({ name: 'symbol', type: 'varchar', nullable: false, comment: 'Symbol of the DAO token' })
  public symbol: string;

  @Column({ name: 'total_supply', type: 'decimal', precision: 18, scale: 6, nullable: false, comment: 'Total supply of the DAO token' })
  public totalSupply: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO token was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO token was last updated' })
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
