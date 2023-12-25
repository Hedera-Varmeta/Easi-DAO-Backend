import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('vote_option')
export class VoteOption {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the vote option' })
  public id: number;

  @Column({ name: 'vote_id', type: 'bigint', nullable: false, comment: 'ID of the selected vote option' })
  public voteId: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, comment: 'Name of the vote option' })
  public name: string;

  @Column({ name: 'description', type: 'text', nullable: true, comment: 'Description of the vote option' })
  public description: string;


  @Column({ name: 'enum_sc', type: 'bigint', nullable: true, comment: 'ID of the selected vote option' })
  public enumSC: number;



  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the vote option was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the vote option was last updated' })
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
