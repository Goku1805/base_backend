"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "Carts",
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

          userId: {
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: "Users",
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
      await queryInterface.createTable(
        "ProductInCarts",
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },

          productId: {
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: "Products",
              key: "id",
            },
          },
          cartId: {
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: "Carts",
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
    await queryInterface.dropTable("ProductInCarts", { transaction });
    await queryInterface.dropTable("Carts", { transaction });
    await transaction.commit();
  },
};
