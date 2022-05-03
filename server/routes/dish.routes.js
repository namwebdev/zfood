const express = require("express");
const dishRouter = express.Router();

const { getDishes, createDishes } = require("../controllers/dish.controllers");

dishRouter.get("/", getDishes);
dishRouter.post("/", createDishes);

module.exports = { dishRouter };
