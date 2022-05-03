const express = require("express");
const restaurantRouter = express.Router();

const {
  getRestaurants,
  createRestaurants,
} = require("../controllers/restaurant.controllers");

restaurantRouter.get("/", getRestaurants);
restaurantRouter.post("/", createRestaurants);

module.exports = { restaurantRouter };
