import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserRole {
  SYSADMIN = "sysadmin",
  ADMIN = "administrator",
  MODERATOR = "moderator",
  VETERAN = "veteran",
  USER = "user",
}

registerEnumType(UserRole, { name: "UserRole" });

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  id!: string;

  @Column()
  @Field(() => String)
  username!: string;

  @Column()
  @Field(() => String)
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "text" })
  @Field(() => String)
  displayName!: string;

  @Column({ type: "text" })
  @Field(() => String)
  avatar!: string;

  @Column({ type: "text", default: "" })
  @Field(() => String)
  description!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: "text", default: "" })
  @Field(() => String)
  status!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  @Field(() => UserRole)
  role!: UserRole;
}
