import "reflect-metadata";
import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import { Restaurants } from "./entities/restaurants";
import { Categories } from "./entities/categories";
import { Dishes } from "./entities/dishes";

export interface DependencyInjector {
  orm: MikroORM;
  em: EntityManager;
  restaurantRepo: EntityRepository<Restaurants>;
  categoriesRepo: EntityRepository<Categories>;
  dishesRepo: EntityRepository<Dishes>
}

export const DI = {} as DependencyInjector;
