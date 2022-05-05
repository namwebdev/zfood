const express = require("express");
const restaurantRouter = express.Router();

const {
  getRestaurants,
  getRestaurantDetails,
  createRestaurants,
} = require("../controllers/restaurant.controllers");

restaurantRouter.get("/", getRestaurants);
restaurantRouter.get("/:id", getRestaurantDetails);
restaurantRouter.post("/", createRestaurants);

module.exports = { restaurantRouter };
