import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('proposal_history')
export class ProposalHistory {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the proposal history' })
  public id: number;

  @Column({ name: 'proposal_id', type: 'bigint', nullable: false, comment: 'ID of the associated proposal' })
  public proposalId: number;

  @Column({ name: 'status', type: 'varchar', nullable: false, comment: 'Status of the proposal' })
  public status: string;

  @Column({ name: 'description', type: 'text', nullable: true, comment: 'Description of the proposal history' })
  public description: string;

  @Column({ name: 'timestamp', type: 'bigint', nullable: false, comment: 'Timestamp of when the proposal history occurred' })
  public timestamp: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the proposal history was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the proposal history was last updated' })
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
