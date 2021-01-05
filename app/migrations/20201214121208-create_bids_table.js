"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Bids", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Users",
          key: "id",
        },
      },
      productId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Products",
          key: "id",
        },
      },
      bidAmount: {
        type: Sequelize.INTEGER.UNSIGNED,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    let transaction;
    transaction = await queryInterface.sequelize.transaction();
    await queryInterface.dropTable("Bids", { transaction });
    await transaction.commit();
  },
};
