import { MikroORM } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { DI } from "./DI";
import { Restaurants } from "./entities/restaurants";
import { Categories } from "./entities/categories";
import { crawlDishesByRestaurant, crawlRestaurants } from "./crawler";
import { Dishes } from "./entities/dishes";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();


const run = async () => {
  DI.orm = await MikroORM.init<PostgreSqlDriver>({
    type: "postgresql",
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,

    entities: [Restaurants, Categories, Dishes],

    allowGlobalContext: true,
  });
  DI.em = DI.orm.em;
  DI.restaurantRepo = DI.orm.em.getRepository(Restaurants);
  DI.categoriesRepo = DI.orm.em.getRepository(Categories);
  DI.dishesRepo = DI.orm.em.getRepository(Dishes)

  try {
    if (DI) {
      console.log("Ứng dụng Mikro-ORM đã khởi động thành công.");
      crawlRestaurants(DI);
    } else throw new Error("Cannot query!");
  } catch (error) {
    console.error("Lỗi trong quá trình chạy ứng dụng:", error);
  }
};

run().catch((error) => {
  console.error("Lỗi trong quá trình khởi động ứng dụng:", error);
});
