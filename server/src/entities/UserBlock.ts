import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
@ObjectType()
export class UserBlock extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  id!: string;

  @Column()
  @Field(() => String)
  user!: string;

  @Column()
  @Field(() => String)
  userId!: string;

  @Column()
  @Field(() => String)
  blocked!: string;

  @Column()
  @Field(() => String)
  blockedId!: string;
}
