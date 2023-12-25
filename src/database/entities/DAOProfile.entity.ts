import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { nowInMillis } from "../../shared/Utils";

@Entity("dao_profile")
export class DAOProfile {
  @PrimaryGeneratedColumn({ comment: "Unique ID for the DAO Delegates" })
  public id: number;

  @Column({ name: "dao_id", type: "bigint", nullable: false })
  public daoId: number;

  @Column({
    name: "user_address",
    type: "varchar",
    nullable: false,
  })
  public userAddress: string;

  @Column({
    name: "bio",
    type: "text",
    nullable: true,
  })
  public bio: string;

  @Column({
    name: "statement",
    type: "text",
    nullable: true,
  })
  public statement: string;

  @Column({
    name: "created_at",
    type: "bigint",
    nullable: false,
    comment: "Timestamp of when the DAO token was created",
  })
  public createdAt: number;

  @Column({
    name: "updated_at",
    type: "bigint",
    nullable: false,
    comment: "Timestamp of when the DAO token was last updated",
  })
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
