import puppeteer, { Page } from "puppeteer";
import { DependencyInjector } from "./DI";
import { ListRestaurantAPI } from "./data";

const targetUrl =
  "https://shopeefood.vn/ho-chi-minh/danh-sach-dia-diem-phuc-vu-food-giao-tan-noi";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const crawlRestaurants = ({ restaurantRepo }: DependencyInjector) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: "new",
        ignoreHTTPSErrors: true,
        defaultViewport: { width: 1920, height: 1080 },
        args: ["--disable-gpu"],
      });
      const page = await browser.newPage();
      await page.goto(targetUrl, {
        waitUntil: "domcontentloaded",
      });

      const data = await fetchRestaurants(page);
      await restaurantRepo.upsertMany(data);
      let currentPage = 1;
      const totalPage = await countPage(page);
      while (currentPage < totalPage) {
        currentPage++;
        await page.waitForTimeout(1000);
        clickNextRestaurantPage(page, currentPage);
        const data = await fetchRestaurants(page);
        await restaurantRepo.upsertMany(data);
        console.log("ok!");
      }
      console.log("Finish crawlRestaurants!");
    } catch (e) {
      console.error(e);
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const crawlDishesByRestaurant = async (DI: DependencyInjector) => {
  const currentRestaurants = await getRestaurantInfos(DI);

  while (currentRestaurants.length > 0) {
    const { request_id, id_type, restaurant_id } =
      getRandomRestaurant(currentRestaurants);
    const _ = await fetchDishes(request_id, id_type);
    await updateCategoryForRestaurant(DI, { request_id, id_type });
    const uniqueArray = _.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.image === value.image)
    );
    const dishes = uniqueArray.map((d) => {
      return {
        ...d,
        ...{ restaurant_id: restaurant_id },
      };
    });
    await DI.dishesRepo.upsertMany(dishes);
    console.log("🚀 ~ file: crawler.ts:56 ~ dishes ~ dishes:", dishes.length);
  }
  console.log("crawlDishesByRestaurant finish!");
};

const getRestaurantInfos = async ({ restaurantRepo }: DependencyInjector) => {
  const currentRestaurants = await restaurantRepo.findAll({
    fields: ["id", "in_platform_id", "in_platform_id_type"],
  });
  return currentRestaurants.map((r) => {
    return {
      restaurant_id: r.id,
      id_type: r.in_platform_id_type,
      request_id: r.in_platform_id,
    };
  });
};

function getRandomRestaurant<T>(array: T[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomObject = array.splice(randomIndex, 1)[0];

  return randomObject;
}

const clickNextRestaurantPage = async (
  page: Page,
  currentPageIndex: number
) => {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForSelector(".pagination", { visible: true });
  const pagination = await page.$$(".pagination > li");

  await pagination[currentPageIndex + 1].click();
};

const countPage = async (page: Page) => {
  await page.waitForSelector(".pagination", { visible: true });
  return await page.evaluate(() => {
    const liList = Array.from(document.querySelectorAll(".pagination > li")); // Select all <li> elements/ Return -1 if no <li> with class "active" is found
    if (liList.length > 0) return liList.length - 2;
    return null;
  });
};

const crawlRestaurantId = async (page: Page) => {
  const payload = await page.waitForRequest(
    "https://gappapi.deliverynow.vn/api/delivery/get_infos"
  );
  const a = await page.waitForResponse(
    "https://gappapi.deliverynow.vn/api/delivery/get_infos"
  );
  console.log(a.text())
  const res = payload.postData()
  if (!res) {
    console.log("🚀 crawlRestaurantId", payload, res);
    throw Error("Cannot get restaurant Ids");
  }
  return res;
};

interface UpdateParams {
  request_id: number;
  id_type: number;
}
const updateCategoryForRestaurant = async (
  { categoriesRepo, restaurantRepo }: DependencyInjector,
  params: UpdateParams
) => {
  const { request_id, id_type } = params;
  const restaurant = await restaurantRepo.findOne({
    in_platform_id: request_id,
  });
  if (restaurant?.category_id !== null && restaurant?.category_id !== undefined)
    return;

  const categoryName = await fetchCategoryByRestaurant(request_id, id_type);

  const category = await categoriesRepo.findOne({
    name: categoryName,
  });

  let category_id = category?.id;
  if (!category)
    category_id = await categoriesRepo.nativeInsert({ name: categoryName });
  await restaurantRepo.nativeUpdate(
    {
      id: restaurant.id,
    },
    { category_id }
  );
};

interface RestaurantResponse {
  restaurant_id: number;
  service_type: number;
  address: string;
  name: string;
  photos: {
    value: string;
  }[];
}
interface RestaurantsResponse {
  reply: {
    delivery_infos: RestaurantResponse[];
  };
}
const fetchRestaurants = async (page: Page) => {
  const body = await crawlRestaurantId(page);
  const options = { ...ListRestaurantAPI.options, ...{ body } };
  const res = await fetch(
    "https://gappapi.deliverynow.vn/api/delivery/get_infos",
    options as RequestInit
  );
  const data: RestaurantsResponse = await res.json();
  if (data?.reply?.delivery_infos)
    return data.reply.delivery_infos.map((i) => {
      return {
        in_platform_id: i.restaurant_id,
        in_platform_id_type: i.service_type,
        address: i.address,
        name: i.name,
        image: i.photos[i.photos.length - 1].value,
      };
    });

  throw Error("Cannot fetch restaurants!");
};

interface DishesResponse {
  reply: {
    menu_infos: {
      dishes: {
        id: number;
        name: string;
        price: {
          value: number;
        };
        photos: {
          value: string;
        }[];
      }[];
    }[];
  };
}
const fetchDishes = async (request_id: number, id_type: number) => {
  const options = { ...ListRestaurantAPI.options, ...{ method: "GET" } };
  const res = await fetch(
    `https://gappapi.deliverynow.vn/api/dish/get_delivery_dishes?id_type=${id_type}&request_id=${request_id}`,
    options as RequestInit
  );
  const data: DishesResponse = await res.json();
  if (data?.reply?.menu_infos) {
    const flatten = <T>(nestedArray: T[][]): T[] =>
      nestedArray.reduce(
        (flatArray, subArray) => flatArray.concat(subArray),
        []
      );

    const _ = data?.reply?.menu_infos.map((i) => {
      return i.dishes.map((_i) => {
        return {
          image: _i.photos[_i.photos.length - 1].value,
          name: _i.name,
          price: _i.price.value,
        };
      });
    });
    return flatten(_);
  }
  throw Error("Cannot fetch dishes!");
};

interface CategoryResponse {
  reply: {
    delivery_detail: {
      categories: string[];
    };
  };
}
const fetchCategoryByRestaurant = async (
  request_id: number,
  id_type: number
) => {
  const options = { ...ListRestaurantAPI.options, ...{ method: "GET" } };
  const res = await fetch(
    `https://gappapi.deliverynow.vn/api/delivery/get_detail?id_type=${id_type}&request_id=${request_id}`,
    options as RequestInit
  );
  const data: CategoryResponse = await res.json();
  const category = data?.reply?.delivery_detail?.categories?.[0];
  if (category) return category.toLowerCase();

  throw Error("Cannot fetch Category of Restaurant!");
};
