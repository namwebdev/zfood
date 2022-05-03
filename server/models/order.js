"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ restaurant, user, dish_order }) {
      this.belongsTo(restaurant, { foreignKey: "restaurant_id" });
      this.belongsTo(user, { foreignKey: "user_id" });

      this.hasMany(dish_order, { foreignKey: "order_id" });
    }
  }
  order.init(
    {
      total_price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
