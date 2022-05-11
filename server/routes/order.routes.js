const express = require("express");
const orderRouter = express.Router();

const { order, getUserOrders } = require("../controllers/order.controllers");

orderRouter.get("/history", getUserOrders);
orderRouter.post("/", order);

module.exports = { orderRouter };
