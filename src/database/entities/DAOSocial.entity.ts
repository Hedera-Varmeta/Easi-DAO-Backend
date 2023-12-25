import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { nowInMillis } from "../../shared/Utils";

@Entity("dao_social")
export class DAOSocial {
  @PrimaryGeneratedColumn({ comment: "Unique ID for the DAO Social" })
  public id: number;

  @Column({ name: "dao_id", type: "bigint", nullable: false })
  public daoId: number;

  @Column({
    name: "type",
    type: "varchar",
    nullable: false,
    comment: "Type of social",
    default: "link",
  })
  public type: string;

  @Column({
    name: "name",
    type: "varchar",
    nullable: true,
    comment: "Name of social",
  })
  public name: string;

  @Column({
    name: "description",
    type: "text",
    nullable: true,
    comment: "description of social",
  })
  public description: string;

  @Column({
    name: "origin",
    type: "varchar",
    nullable: true,
    comment: "Domain of social",
  })
  public origin: string;

  @Column({
    name: "username",
    type: "varchar",
    nullable: true,
    comment: "Username of social",
  })
  public username: string;

  @Column({
    name: "url",
    type: "varchar",
    nullable: true,
    comment: "Url of link",
  })
  public url: string;

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
