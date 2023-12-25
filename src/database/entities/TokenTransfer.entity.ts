import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('token_transfer')
export class TokenTransfer {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the token transfer' })
  public id: number;

  @Column({ name: 'from_address', type: 'varchar', nullable: false, comment: 'Address of the sender' })
  public fromAddress: string;

  @Column({ name: 'to_address', type: 'varchar', nullable: false, comment: 'Address of the recipient' })
  public toAddress: string;

  @Column({ name: 'token_id', type: 'bigint', nullable: false, comment: 'ID of the token being transferred' })
  public tokenId: number;

  @Column({ name: 'amount', type: 'varchar' })
  public amount: string;

  @Column({ name: 'timestamp', type: 'bigint', nullable: false, comment: 'Timestamp of when the transfer occurred' })
  public timestamp: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the transfer was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the transfer was last updated' })
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
