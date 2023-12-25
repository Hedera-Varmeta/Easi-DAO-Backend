import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('governors_setting')
export class GovernorsSetting {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the governor' })
  public id: number;

  @Column({ name: 'setting_name', type: 'varchar', nullable: false, comment: 'Name of the governor' })
  public settingName: string;

  @Column({ name: 'setting_description', type: 'varchar', nullable: true, comment: 'Wallet address of the governor' })
  public settingDescription: string;

  @Column({ name: 'type_id', nullable: false, comment: 'Foreign key referencing Governors' })
  public typeId: number;

  @Column({ name: 'num_of_order', type: 'int', nullable: false, comment: 'Order of the setting field' })
  public numOfOrder: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the governor was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the governor was last updated' })
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
