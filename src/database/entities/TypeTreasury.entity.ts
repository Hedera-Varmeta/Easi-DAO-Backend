import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('type_treasury')
export class TypeTreasury {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the DAO treasury' })
  public id: number;

  @Column({ name: 'type_name', type: 'varchar', nullable: false, comment: 'Asset held in the treasury' })
  public typeName: string;

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
 