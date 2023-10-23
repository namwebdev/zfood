import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base";

@Entity()
export class Categories extends BaseEntity {
  @Property()
  name!: string;
}
