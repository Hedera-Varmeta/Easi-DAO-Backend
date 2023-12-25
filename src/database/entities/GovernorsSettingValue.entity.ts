import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('governors_setting_value')
export class GovernorsSettingValue {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the governor setting value' })
  public id: number;

  @Column({ name: 'field_id', nullable: false, comment: 'Foreign key referencing GovernorsSettingField' })
  public fieldId: number;

  @Column({ name: 'governor_id', nullable: true, comment: 'Foreign key referencing Governors' })
  public governorId: number;

  @Column({ name: 'field_value', type: 'varchar', nullable: false, comment: 'Value of the setting field' })
  public fieldValue: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the governor setting value was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the governor setting value was last updated' })
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
