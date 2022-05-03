const express = require("express");
const rootRouter = express.Router();

const { restaurantRouter } = require("./restaurant.routes");
const { dishRouter } = require("./dish.routes");
const { orderRouter } = require("./order.routes");
const { register, login } = require("../controllers/auth.controllers");
const { authenticate } = require("../middlewares/auth/authenticate");

rootRouter.get("/", (req, res) => res.send("API Version 1"));

rootRouter.use("/restaurants", restaurantRouter);
rootRouter.use("/dishes", dishRouter);
rootRouter.use("/order", authenticate, orderRouter);

// auth routes
rootRouter.post("/register", register);
rootRouter.post("/login", login);

module.exports = { rootRouter };
