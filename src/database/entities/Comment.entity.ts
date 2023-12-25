import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the comment' })
  public id: number;

  @Column({ name: 'proposal_id', type: 'bigint', nullable: false, comment: 'ID of the associated proposal' })
  public proposalId: number;

  @Column({ name: 'author_id', type: 'bigint', nullable: false, comment: 'ID of the author of the comment' })
  public authorId: number;

  @Column({ name: 'content', type: 'text', nullable: false, comment: 'Content of the comment' })
  public content: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the comment was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the comment was last updated' })
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
