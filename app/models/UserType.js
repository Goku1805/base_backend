import { sequelize, Sequelize } from "./setup.js";

/*
 * ============================================
 * USER TYPE
 * ============================================
 */
class UserType extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

UserType.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    slug: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    description: {
      allowNull: false,
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: sequelize,
    modelName: "UserType",
  }
);

UserType.types = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  DELIVERYBOY: "deliveryboy",
};

export { UserType };
