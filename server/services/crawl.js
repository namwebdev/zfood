const puppeteer = require("puppeteer");
const { restaurant, dish } = require("../models/");

const crawl = () => {
  return new Promise(async (resolve, reject) => {
    const currentRestaurants = await restaurant.findAll({
      attributes: ["image"],
    });
    try {


      const browser = await puppeteer.launch({ headless: true });
      let page = await browser.newPage();
      await page.goto(`https://shopeefood.vn/ho-chi-minh/danh-sach-dia-diem-phuc-vu-food-giao-tan-noi`, {
        waitUntil: "load",
      });
      await page.waitForSelector(".item-content .img-restaurant > img", {
        visible: true,
      });
      await page.evaluate((_) => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      const list = await page.$$(".item-restaurant");
      let listRestaurant = [];
      for (let i = 0; i < list.length; i++) {
        let DOM = await list[i].$(".item-content");
        const link = await DOM.evaluate((el) => el.getAttribute("href"));

        await list[i].waitForSelector(".item-content .img-restaurant > img", {
          visible: true,
        });
        DOM = await list[i].$(".item-content .img-restaurant > img");
        const image = await DOM.evaluate((el) => el.getAttribute("src"));
        if (image && link) {
          const isExist = currentRestaurants.some(
            (img) => img.dataValues.image === image.replace("280x175", "640x400")
          );
          if (!isExist)
            listRestaurant.push({
              link: `https://shopeefood.vn${link}`,
              image: image.replace("280x175", "640x400"),
            });
        }
      }

      for (let i = 0; i < listRestaurant.length; i++) {
        page = await browser.newPage();
        await crawlDishes(
          page,
          listRestaurant[i].link,
          listRestaurant[i].image
        );
      }
      console.log("finish");
    } catch (e) {
      console.error(e);
    }
  });
};

const crawlDishes = async (page, link, restaurantImage) => {
  await page.goto(link, { waitUntil: "load" });
  await page.waitForSelector(".item-restaurant-row img", {
    visible: true,
  });

  //   restaurant info
  let DOM = await page.$(".name-restaurant");
  const name = await DOM.evaluate((el) => el.textContent);

  DOM = await page.$(".address-restaurant");
  const address = await DOM.evaluate((el) => el.textContent);

  DOM = await page.$(".kind-restaurant > span");
  const category = await DOM.evaluate((el) => el.textContent);
  //

  const newRestaurant = await restaurant.create({
    name,
    address,
    image: restaurantImage,
    category: category.split(" -")[0],
  });

  await page.evaluate((_) => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  const dishes = await page.$$(".item-restaurant-row");
  const res = [];
  for (let i = 0; i < dishes.length; i++) {
    let DOM = await dishes[i].$("h2.item-restaurant-name");
    const name = await DOM.evaluate((el) => el.textContent);

    DOM = await dishes[i].$(".item-restaurant-desc");
    let description = null;
    if (DOM) description = await DOM.evaluate((el) => el.textContent);

    DOM = await dishes[i].$(".current-price");
    const price = await DOM.evaluate((el) => el.textContent);

    DOM = await dishes[i].$("img");
    const image = await DOM.evaluate((el) => el.getAttribute("src"));

    if (!res.some((i) => i.image === image)) {
      res.push({
        name,
        ...(description && description.length < 100 && { description }),
        price: price.split(",")[0] + "000",
        image,
        restaurant_id: newRestaurant.id,
      });
      await dish.bulkCreate(res).then(() => {
        console.log("ok");
      });
    }
  }
  await page.close();
};

module.exports = { crawl };
