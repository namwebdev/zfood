const {
  order: orderModel,
  restaurant,
  dish_order,
  dish: dishModel,
} = require("../models");

const order = async (req, res) => {
  // dishes = [{dish_id: 1, quantity: 2}, {dish_id: 2, quantity: 3}];
  const { user_id } = req;
  const { total_price, restaurant_id, dishes } = req.body;
  try {
    if (!(total_price && restaurant_id && dishes)) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
    if (!(Array.isArray(dishes) && dishes.length > 0)) {
      res.status(400).json({ message: "Bad request" });
      return;
    }

    let isDishesInvalid = false;
    for await (dish of dishes) {
      if (!(dish.dish_id && dish.quantity)) {
        isDishesInvalid = true;
        res.status(400).json({ message: "Bad request" });
        break;
      }

      if (isDishesInvalid) return;
      const isDishExist = await dishModel.findOne({
        where: { id: dish.dish_id },
        attributes: ["id"],
      });
      if (!isDishExist) {
        isDishesInvalid = true;
        res.status(404).json({ message: `Dish id ${dish.dish_id} not found` });
        break;
      }
    }
    if (isDishesInvalid) return;

    const isRestaurantExist = await restaurant.findOne({
      where: { id: restaurant_id },
      attributes: ["id"],
    });
    if (!isRestaurantExist) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const newOrder = await orderModel.create({
      total_price,
      user_id,
      restaurant_id,
    });
    for await (const dish of dishes) {
      await dish_order.create({
        dish_id: dish.dish_id,
        order_id: newOrder.id,
        quantity: dish.quantity,
      });
    }
    res.status(201).json({
      message: "Order successfully",
    });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const getUserOrders = async (req, res) => {
  const { user_id } = req;
  try {
    const orders = await orderModel.findAll({
      where: { user_id },
      include: [
        { model: restaurant, attributes: ["name", "image"] },
        {
          model: dish_order,
          attributes: ["dish_id", "quantity"],
          include: [
            {
              model: dishModel,
              attributes: ["name", "image", "price"],
            },
          ],
        },
      ],
    });
    res.status(201).json({
      data: orders,
    });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

module.exports = { order, getUserOrders };
