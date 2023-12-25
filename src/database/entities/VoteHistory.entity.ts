import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('vote_history')
export class VoteHistory {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the vote history' })
  public id: number;

  @Column({ name: 'proposal_id', type: 'bigint', nullable: false, comment: 'ID of the associated proposal' })
  public proposalId: number;

  @Column({ name: 'voter_id', type: 'bigint', nullable: false, comment: 'ID of the voter' })
  public voterId: number;

  @Column({ name: 'vote_address', type: 'varchar', nullable: true, comment: 'Vote token of the governor' })
  public voteAddress: string;

  @Column({ name: 'vote_comment', type: 'text', nullable: true, comment: 'Comment of the vote' })
  public voteComment: string;

  @Column({ name: 'vote_power', type: 'varchar', nullable: true, comment: 'Voting Power of the vote', default:'0' })
  public votePower: string;

  @Column({ name: 'vote_option_id', type: 'bigint', nullable: false, comment: 'ID of the selected vote option' })
  public voteOptionId: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the vote history was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the vote history was last updated' })
  public updatedAt: number;

  @Column({name: 'status', type: 'tinyint', width: 1, nullable: false, default: 1})
  public status: boolean;


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
