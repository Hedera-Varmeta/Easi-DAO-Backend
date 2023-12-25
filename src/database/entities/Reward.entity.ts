import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('reward')
export class Reward {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the reward' })
  public id: number;

  @Column({ name: 'member_id', type: 'bigint', nullable: false, comment: 'ID of the member receiving the reward' })
  public memberId: number;

  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 6, nullable: false, comment: 'Amount of the reward' })
  public amount: number;

  @Column({ name: 'reason', type: 'text', nullable: false, comment: 'Reason for the reward' })
  public reason: string;

  @Column({ name: 'timestamp', type: 'bigint', nullable: false, comment: 'Timestamp of when the reward was granted' })
  public timestamp: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the reward was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the reward was last updated' })
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
