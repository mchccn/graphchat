import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Article } from "./Article";
import { User } from "./User";

@Entity()
@ObjectType()
export class ArticleComment extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  id!: string;

  @ManyToOne(() => Article, { cascade: ["update"] })
  @Field(() => Article)
  article!: Article;

  @Column()
  articleId!: string;

  @ManyToOne(() => User, { cascade: ["update"] })
  @Field(() => User)
  author!: User;

  @Column()
  authorId!: string;

  @ManyToOne(() => ArticleComment, { cascade: ["update"] })
  @Field(() => ArticleComment)
  parent?: ArticleComment;

  @Column()
  parentId?: string;

  @Column({ type: "text" })
  @Field(() => String)
  content!: string;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  likes!: number;
}
