
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class UserAccount extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique: true})
  name!: string;
  
  @Field()
  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @Field(()=> String)
  @CreateDateColumn()
  createdAt: Date ;

  @Field(()=> String)
  @UpdateDateColumn()
  updatedAt: Date ;

}