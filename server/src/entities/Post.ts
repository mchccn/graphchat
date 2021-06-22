import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  id!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @Field(() => User)
  author!: User;

  @Column()
  @Field(() => String)
  authorId!: string;

  @Column({ type: "text" })
  @Field(() => String)
  title!: string;

  @Column({ type: "text" })
  @Field(() => String)
  slug!: string;

  @Column({ type: "text" })
  @Field(() => String)
  content!: string;

  @Column({ type: "int" })
  @Field(() => Int)
  likes!: number;
}
