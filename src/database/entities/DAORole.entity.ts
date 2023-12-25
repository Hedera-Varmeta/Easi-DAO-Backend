import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('dao_role')
export class DAORole {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the DAO role' })
  public id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, comment: 'Name of the DAO role' })
  public name: string;

  @Column({ name: 'description', type: 'text', nullable: true, comment: 'Description of the DAO role' })
  public description: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO role was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO role was last updated' })
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
