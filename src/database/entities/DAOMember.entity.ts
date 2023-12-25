import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('dao_member')
export class DAOMember {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'dao_id', type: 'bigint', nullable: false })
  public daoId: number;

  @Column({ name: 'role_id', type: 'bigint', nullable: false })
  public roleId: number;

  @Column({ name: 'member_name', type: 'varchar', nullable: false })
  public memberName: string;

  @Column({ name: 'member_address', type: 'varchar', nullable: false })
  public memberAddress: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: true })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: true })
  public updatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = nowInMillis();
    this.updatedAt = nowInMillis();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = nowInMillis();
  }
}
