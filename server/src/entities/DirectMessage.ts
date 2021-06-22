import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class DirectMessage extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  id!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @JoinColumn()
  @Field(() => User)
  sender!: User;

  @ManyToOne(() => User, { cascade: ["update"] })
  @JoinColumn()
  @Field(() => User)
  receiver!: User;

  @Column()
  senderId!: string;

  @Column()
  receiverId!: string;

  @Column({ type: "text" })
  @Field(() => String)
  content!: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt!: Date;
}
