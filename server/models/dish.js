"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ restaurant, dish_order }) {
      this.belongsTo(restaurant, { foreignKey: "restaurant_id" });

      this.hasMany(dish_order, { foreignKey: "dish_id" });
    }
  }
  dish.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "dish",
    }
  );
  return dish;
};
