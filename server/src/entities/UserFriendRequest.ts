import { Field, ObjectType } from "type-graphql";
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
export class UserFriendRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @JoinColumn()
  @Field(() => User)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @JoinColumn()
  @Field(() => User)
  friend!: User;

  @Column()
  friendId!: string;
}
