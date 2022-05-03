const { order: orderModel, restaurant } = require("../models");

const order = async (req, res) => {
  // dishes = [{dish_id: 1, quantity: 2}, {dish_id: 2, quantity: 3}];
  const { user_id } = req;
  const { total_price, restaurant_id } = req.body;
  try {
    if (!(total_price && restaurant_id)) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
    const isRestaurantExist = await restaurant.findOne({
      where: { id: restaurant_id },
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
    res.status(201).json({
      data: newOrder,
      message: "Order successfully",
    });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

module.exports = { order };
