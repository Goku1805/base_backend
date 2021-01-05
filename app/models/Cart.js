import { sequelize, Sequelize } from "./setup.js";

/*
 * ============================================
 * ORDER
 * ============================================
 */
class Cart extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

Cart.init(
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV1,
    },
    quantity: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Cart",
  }
);

class ProductInCart extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

ProductInCart.init(
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize: sequelize,
    modelName: "ProductInCart",
  }
);

export { Cart, ProductInCart };
