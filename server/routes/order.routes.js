const express = require("express");
const orderRouter = express.Router();

const { order } = require("../controllers/order.controllers");

orderRouter.post("/", order);

module.exports = { orderRouter };
