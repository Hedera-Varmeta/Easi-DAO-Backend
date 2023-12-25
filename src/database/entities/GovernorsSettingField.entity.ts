import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('governors_setting_field')
export class GovernorsSettingField {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the governor setting field' })
  public id: number;

  @Column({ name: 'field_name', type: 'varchar', nullable: false, comment: 'Name of the setting field' })
  public fieldName: string;

  @Column({ name: 'field_value', type: 'varchar', nullable: false, comment: 'Value of the setting field' })
  public fieldValue: string;


  @Column({ name: 'field_description', type: 'varchar', nullable: true, comment: 'Value of the setting field' })
  public fieldDescription: string;


  @Column({ name: 'field_placeholder', type: 'varchar', nullable: true, comment: 'Value of the setting field' })
  public fieldPlaceholder: string;

  @Column({ name: 'setting_id', nullable: false, comment: 'Foreign key referencing GovernorsSetting' })
  public settingId: number;

  @Column({ name: 'num_of_order', type: 'int', nullable: false, comment: 'Order of the setting field' })
  public numOfOrder: number;

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
