import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserAccount } from "./UserAccount";

@ObjectType()
@Entity()
export class Post extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({type: "int", default: 0})
  point!: number;

  @Field(()=> String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(()=> String)
  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @Field()
  @Column()
  createId: number;

  @ManyToOne(() => UserAccount, userAccount => userAccount.posts)
  creator:UserAccount 
}