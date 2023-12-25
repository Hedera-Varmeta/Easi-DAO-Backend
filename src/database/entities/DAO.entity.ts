import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('dao')
export class DAO {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the DAO' })
  public id: number;

  @Column({ name: 'dao_name', type: 'varchar', nullable: false, comment: 'Name of the DAO' })
  public daoName: string;

  @Column({ name: 'dao_description', type: 'text', nullable: true, comment: 'Description of the DAO' })
  public daoDescription: string;

  @Column({ name: 'governor_id', type: 'int', nullable: false, comment: 'id the governor' })
  public governorId: number;

  @Column({ name: 'dao_logo', type: 'text', nullable: true, comment: 'Logo of the DAO' })
  public daoLogo: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the DAO was last updated' })
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
