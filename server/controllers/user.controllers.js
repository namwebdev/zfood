const { user } = require("../models/index");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  const { user_id } = req;
  try {
    const userToFind = await user.findOne({ where: { id: user_id } });
    if (userToFind) {
      let { password, ...userInfo } = userToFind?.dataValues;
      res.status(200).json({ data: userInfo });
      return;
    }
    res.status(404).json({ message: "User not found" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateInfo = async (req, res) => {
  const { user_id } = req;
  const { name, address, phone } = req.body;
  try {
    const form = {
      ...(name && { name }),
      ...(address && { address }),
      ...(phone && { phone }),
    };
    if (Object.keys(form).length === 0) {
      res.status(400).json({ message: "No data to update" });
      return;
    }
    await user.update(form, { where: { id: user_id } });
    res.status(200).json({ message: "Update information success" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const changePassword = async (req, res) => {
  const { user_id } = req;
  const { password, new_password } = req.body;
  try {
    if (password === new_password) {
      res.status(400).json({ message: "New password must be different" });
      return;
    }
    const userToFind = await user.findOne({ where: { id: user_id } });
    const isMatchPassword = bcrypt.compareSync(password, userToFind.password);
    if (!isMatchPassword) {
      res.status(401).json({ message: "Old password is incorrect" });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(new_password, salt);
    await user.update({ password: hashPassword }, { where: { id: user_id } });
    res.status(200).json({ message: "Change password success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
};

module.exports = { getUser, updateInfo, changePassword };
