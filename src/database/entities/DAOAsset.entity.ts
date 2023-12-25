import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('dao_asset')
export class DAOAsset {
  @PrimaryGeneratedColumn({ comment: 'Unique ID for the DAO asset' })
  public id: number;

  @Column({ name: 'dao_id', type: 'bigint', nullable: false, comment: 'ID of the DAO that the asset belongs to' })
  public daoId: number;

  @Column({ name: 'asset_name', type: 'varchar', nullable: false, comment: 'Name of the asset' })
  public assetName: string;

  @Column({ name: 'asset_type', type: 'varchar', nullable: true, comment: 'Type of the asset' })
  public assetType: string;

  @Column({ name: 'asset_value', type: 'decimal', precision: 10, scale: 2, nullable: false, comment: 'Value of the asset' })
  public assetValue: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the asset was created' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false, comment: 'Timestamp of when the asset was last updated' })
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
