import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  id!: string;

  @Column({ type: "varchar", length: 255 })
  @Field(() => String)
  username!: string;

  @Column({ type: "text" })
  @Field(() => String)
  displayName!: string;

  @Column({ type: "text", default: "" })
  @Field(() => String)
  description!: string;
}
