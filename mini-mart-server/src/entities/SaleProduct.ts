import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class SaleProduct {

  @PrimaryKey()
  id!: number;  

  @Property({type:"date"})
  createdAt: Date = new Date();

  @Property({type:"date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  productId!: number;

  @Property()
  amount!: number;

  @Property()
  discount!: number;

}