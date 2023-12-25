import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('proposal')
export class Proposal {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'dao_id', type: 'bigint', nullable: false, comment: 'ID of the DAO that the proposal belongs to' })
  public daoId: number;

  @Column({ name: 'proposal_id', type: 'varchar', nullable: true, comment: 'Title of the proposal' })
  public proposalId: string;

  @Column({ name: 'proposal_title', type: 'varchar', nullable: false, comment: 'Title of the proposal' })
  public proposalTitle: string;

  @Column({ name: 'proposal_description', type: 'text', nullable: true, comment: 'Description of the proposal' })
  public proposalDescription: string;

  @Column({ name: 'proposal_snapshot', type: 'bigint', nullable: true, comment: 'ID of the selected vote option' })
  public proposalSnapshot: number;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  public imageUrl: string;


  @Column({ name: 'meta_data', type: 'text', nullable: true })
  public metaData: string;

  @Column({ name: 'address_arr', type: 'text', nullable: true })
  public addressArr: string;


  @Column({ name: 'value_arr', type: 'text', nullable: true })
  public valueArr: string;


  @Column({ name: 'encode_arr', type: 'text', nullable: true })
  public encodeArr: string;


  @Column({ name: 'data', type: 'text', nullable: true })
  public data: string;

  @Column({ name: 'calldatas', type: 'longtext', nullable: true, comment: 'Vote token of the governor' })
  public calldatas: string;


  @Column({ name: 'values', type: 'longtext', nullable: true, comment: 'Vote token of the governor' })
  public values: string;


  @Column({ name: 'action_name', type: 'longtext', nullable: true, comment: 'Vote token of the governor' })
  public actionName: string;

  @Column({ name: 'encode_data', type: 'longtext', nullable: true, comment: 'Vote token of the governor' })
  public encodeData: string;


  @Column({ name: 'proposal_deadline', type: 'bigint', nullable: true, comment: 'ID of the selected vote option' })
  public proposalDeadline: number;


  @Column({ name: 'proposal_status', type: 'varchar', nullable: true, comment: 'Status of the proposal' })
  public proposalStatus: string;

  @Column({ name: 'proposal_votes_id', type: 'int', nullable: true, comment: 'Number of votes for the proposal' })
  public proposalVotesId: number;


  @Column({name: 'status', type: 'tinyint', width: 1, nullable: false, default: 1})
  public status: boolean;

  @Column({ name: 'proposal_created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the proposal was created' })
  public proposalCreatedAt: number;

  @Column({ name: 'proposal_updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the proposal was last updated' })
  public proposalUpdatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.proposalCreatedAt = nowInMillis();
    this.proposalUpdatedAt = nowInMillis();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.proposalUpdatedAt = nowInMillis();
  }
}
