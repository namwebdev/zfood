import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./base";

@Entity()
export class Dishes extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  @Unique()
  image!: string;

  @Property()
  price!: number;

  @Property()
  restaurant_id!: number;
}
