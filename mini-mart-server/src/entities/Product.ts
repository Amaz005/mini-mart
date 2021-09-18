import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Product {

  @PrimaryKey()
  id!: number;  

  @Property({type:"date"})
  createdAt: Date = new Date();

  @Property({type:"date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  importPrice!: number;

  @Property()
  salePrice!: number;  

  @Property()
  amount!: number;

}