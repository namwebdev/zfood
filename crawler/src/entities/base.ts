import {   PrimaryKey, Unique } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey()
  @Unique()
  id!: number;
}
