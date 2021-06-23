import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  id!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @Field(() => User)
  author!: User;

  @Column()
  authorId!: string;

  @Column({ type: "text" })
  @Field(() => String)
  title!: string;

  @Column({ type: "text", default: 0 })
  @Field(() => String)
  slug!: string;

  @Column({ type: "text" })
  @Field(() => String)
  content!: string;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  likes!: number;
}
