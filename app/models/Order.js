import { sequelize, Sequelize } from "./setup.js";

/*
 * ============================================
 * ORDER
 * ============================================
 */
const orderStatus = {
  CREATED: "created",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

class Order extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

Order.init(
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

    paymentStatus: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: orderStatus.CREATED,
      validate: {
        isIn: {
          args: [
            [orderStatus.CREATED, orderStatus.COMPLETED, orderStatus.CANCELLED],
          ],
          msg: `Not a valid orderStatus. It should be one of these values: ${Object.keys(
            orderStatus
          )
            .map((k) => orderStatus[k])
            .join(", ")}`,
        },
      },
    },

    cgst: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    cgstTotal: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    sgst: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    sgstTotal: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    offerDiscount: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    couponDiscount: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    subtotal: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    total: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Order",
  }
);

class PaymentMethod extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

PaymentMethod.init(
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
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "PaymentMethod",
  }
);

export { Order, PaymentMethod };
