import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the transaction' })
  public id: number;

  @Column({ name: 'from_address', type: 'varchar', nullable: false, comment: 'Address of the sender' })
  public fromAddress: string;

  @Column({ name: 'to_address', type: 'varchar', nullable: false, comment: 'Address of the recipient' })
  public toAddress: string;

  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 6, nullable: false, comment: 'Amount of the transaction' })
  public amount: number;

  @Column({ name: 'timestamp', type: 'bigint', nullable: false, comment: 'Timestamp of when the transaction occurred' })
  public timestamp: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the transaction was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the transaction was last updated' })
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
