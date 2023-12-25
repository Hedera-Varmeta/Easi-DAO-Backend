import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the event' })
  public id: number;

  @Column({ name: 'event_type', type: 'varchar', nullable: false, comment: 'Type of the event' })
  public eventType: string;

  @Column({ name: 'description', type: 'text', nullable: true, comment: 'Description of the event' })
  public description: string;

  @Column({ name: 'timestamp', type: 'bigint', nullable: false, comment: 'Timestamp of when the event occurred' })
  public timestamp: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the event was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the event was last updated' })
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
