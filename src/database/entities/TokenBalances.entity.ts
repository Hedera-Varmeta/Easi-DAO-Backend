import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('token_balances')
export class TokenBalances {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the token balance' })
  public id: number;

  @Column({ name: 'member_id', type: 'bigint', nullable: false, comment: 'ID of the member' })
  public memberId: number;

  @Column({ name: 'token_id', type: 'bigint', nullable: false, comment: 'ID of the token' })
  public tokenId: number;

  @Column({ name: 'balance', type: 'decimal', precision: 18, scale: 6, nullable: false, comment: 'Balance of the token' })
  public balance: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the token balance was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the token balance was last updated' })
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
