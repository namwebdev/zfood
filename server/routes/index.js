const express = require("express");
const rootRouter = express.Router();

const { restaurantRouter } = require("./restaurant.routes");
const { dishRouter } = require("./dish.routes");
const { orderRouter } = require("./order.routes");
const { register, login, getUser } = require("../controllers/auth.controllers");
const { authenticate } = require("../middlewares/auth/authenticate");
const { userRouter } = require("./user.routes");

rootRouter.get("/", (req, res) => res.send("API Version 1"));

rootRouter.use("/restaurants", restaurantRouter);
rootRouter.use("/dishes", dishRouter);
rootRouter.use("/order", authenticate, orderRouter);
rootRouter.use("/user", authenticate, userRouter);

// auth routes
rootRouter.post("/register", register);
rootRouter.post("/login", login);

module.exports = { rootRouter };
