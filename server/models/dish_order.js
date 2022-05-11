"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dish_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ dish, order }) {
      this.belongsTo(dish, { foreignKey: "dish_id" });
      this.belongsTo(order, { foreignKey: "order_id" });
    }
  }
  dish_order.init(
    {
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "dish_order",
    }
  );
  return dish_order;
};
