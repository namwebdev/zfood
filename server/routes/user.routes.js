const express = require("express");
const {
  updateInfo,
  getUser,
  changePassword,
} = require("../controllers/user.controllers");

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.put("/update-info", updateInfo);
userRouter.put("/change-password", changePassword);

module.exports = { userRouter };
