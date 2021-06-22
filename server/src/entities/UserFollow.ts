import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserFollow extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @ManyToOne(() => User, { cascade: ["update"] })
  @JoinColumn()
  @Field(() => User)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @JoinColumn()
  @Field(() => User)
  followed!: User;

  @Column()
  followedId!: string;
}
