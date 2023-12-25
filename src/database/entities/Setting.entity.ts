import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('setting')
export class Setting {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the setting' })
  public id: number;

  @Column({ name: 'key', type: 'varchar', nullable: false, comment: 'Key of the setting' })
  public key: string;

  @Column({ name: 'value', type: 'text', nullable: false, comment: 'Value of the setting' })
  public value: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the setting was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the setting was last updated' })
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
