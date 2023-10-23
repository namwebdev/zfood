import { Collection, Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./base";
import { Categories } from "./categories";
import { Dishes } from "./dishes";

@Entity()
export class Restaurants extends BaseEntity {
  @Property()
  @Unique()
  in_platform_id!: number;

  @Property()
  in_platform_id_type!: number;

  @Property()
  image!: string;

  @Property()
  name!: string;

  @Property()
  address?: string;

  @Property()
  category_id?: number;

}
