const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { user: userModel } = require("../models/index");
const TOKEN_SECRET_KEY = require("../constants");

const register = async (req, res, next) => {
  const { name, address, password, phone } = req.body;
  const user = await userModel.findOne({ where: { phone } });
  if (user) {
    res.status(409).json({ message: "Phone already exists" });
    return;
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    await userModel.create({
      name,
      address,
      password: hashPassword,
      phone,
    });
    res.status(201).json({ message: "Register success" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await userModel.findOne({ where: { phone } });
    if (user) {
      const isAuth = bcrypt.compareSync(password, user.password);
      if (isAuth) {
        const token = jwt.sign({ user_id: user.id }, TOKEN_SECRET_KEY, {
          expiresIn: 60 * 60 * 24 * 30,
        });
        res.status(200).json({ message: "Login success", token });
      } else res.status(401).json({ message: "Phone or password incorrect" });
    } else res.status(404).json({ message: "Phone not found" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = { register, login };
