import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('governors_type')
export class GovernorsType {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the governor' })
  public id: number;

  @Column({ name: 'type_name', type: 'varchar', nullable: false, comment: 'Name of the governor' })
  public typeName: string;

  @Column({ name: 'type_description', type: 'varchar', nullable: true, comment: 'Wallet address of the governor' })
  public typeDescription: string;

  @Column({ name: 'type_status', type: 'varchar', nullable: true, comment: 'Wallet address of the governor' })
  public typeStatus: string;

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
