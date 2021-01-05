import { sequelize, Sequelize } from "./setup.js";

/*
 * ============================================
 * Bid
 * ============================================
 */
class Bid extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
  async getBidOfProduct(productUUID) {}
  async createBid() {}
}

Bid.init(
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    bidAmount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    bidEndTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Bid",
  }
);

export { Bid };
