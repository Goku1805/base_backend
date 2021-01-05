import { sequelize, Sequelize } from "./setup.js";

/*
 * ============================================
 * CURRENCY
 * ============================================
 */
class Currency extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

Currency.init(
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Currency",
  }
);

export { Currency };
