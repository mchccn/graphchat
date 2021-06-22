import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class UserBan extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  case!: number;

  @Column()
  @Field(() => String)
  offender!: string;

  @Column()
  offenderId!: string;

  @Column()
  @Field(() => String)
  moderator!: string;

  @Column()
  moderatorId!: string;

  @Column({ type: "text" })
  @Field(() => String)
  reason!: string;

  @Column({ type: "timestamptz" })
  @Field(() => Date)
  expires!: Date;

  @CreateDateColumn()
  @Field(() => String)
  createdAt!: Date;
}
