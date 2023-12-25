import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('vote')
export class Vote {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the vote' })
  public id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, comment: 'Name of the vote' })
  public name: string;

  @Column({ name: 'description', type: 'varchar', nullable: false, comment: 'Description of the vote' })
  public description: string;


  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the vote was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the vote was last updated' })
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
