const { restaurant } = require("../models");

const getRestaurants = async (req, res) => {
  const { name } = req.query;
  try {
    const restaurants = await restaurant.findAll();
    res.status(200).json({
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const createRestaurants = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      restaurant.bulkCreate(req.body, { returning: true }).then((result) =>
        res.status(201).json({
          data: result,
          message: "Create list Restaurant successfully",
        })
      );
      return;
    }
    const { name, address, image, category } = req.body;
    const newRestaurant = await restaurant.create({
      name,
      address,
      image,
      category,
    });
    res.status(201).json({
      data: newRestaurant,
      message: "Create Restaurant successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = { getRestaurants, createRestaurants };
