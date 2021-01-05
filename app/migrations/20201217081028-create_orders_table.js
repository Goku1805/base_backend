"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "PaymentMethods",
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

          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        "Orders",
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

          userId: {
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: "Users",
              key: "id",
            },
          },
          paymentMethodId: {
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: "PaymentMethods",
              key: "id",
            },
          },
          currencyId: {
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: "Currencies",
              key: "id",
            },
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
        { transaction }
      );
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }
  },

  down: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    await queryInterface.dropTable("Orders", { transaction });
    await queryInterface.dropTable("PaymentMethods", { transaction });
    await transaction.commit();
  },
};
