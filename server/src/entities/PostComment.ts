import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
@ObjectType()
export class PostComment {
  @PrimaryColumn()
  @Field(() => String)
  id!: string;

  @ManyToOne(() => Post, { cascade: ["update"] })
  @Field(() => Post)
  post!: Post;

  @Column()
  postId!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @Field(() => User)
  author!: User;

  @Column()
  @Field(() => String)
  authorId!: string;

  @Column({ type: "text" })
  @Field(() => String)
  content!: string;

  @Column({ type: "int" })
  @Field(() => Int)
  likes!: number;
}
