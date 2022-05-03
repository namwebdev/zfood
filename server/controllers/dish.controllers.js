const { restaurant, dish } = require("../models");
const { setPagination } = require("../services/pagination");
const { Op } = require("sequelize");

const getDishes = async (req, res) => {
  const { restaurant_id } = req.query;

  try {
    if (restaurant_id) {
      const isRestaurantExist = await restaurant.findOne({
        where: { id: restaurant_id },
      });
      if (isRestaurantExist) {
        const dishes = await dish.findAll({
          order: [["id", "DESC"]],
          where: { restaurant_id },
        });
        res.status(200).json({ data: dishes || [] });
        return;
      }
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const createDishes = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      dish.bulkCreate(req.body, { returning: true }).then((result) =>
        res.status(201).json({
          data: result,
          message: "Create list Dishes successfully",
        })
      );
      return;
    }
    const { name, description = null, image, price, restaurant_id } = req.body;
    const newDish = await restaurant.create({
      name,
      description,
      image,
      price,
      restaurant_id,
    });
    res.status(201).json({
      data: newDish,
      message: "Create Dish successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = { getDishes, createDishes };
