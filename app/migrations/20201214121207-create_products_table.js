"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ProductCategories", {
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
    });
    await queryInterface.createTable("Products", {
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
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      productType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      minimumBidValue: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Users",
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
      productCategoryId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "ProductCategories",
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
    });

    await queryInterface.createTable("ProductInMedia", {
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
      mediaId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Media",
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    let transaction;
    transaction = await queryInterface.sequelize.transaction();
    await queryInterface.dropTable("ProductInMedia", { transaction });
    await queryInterface.dropTable("Products", { transaction });
    await queryInterface.dropTable("ProductCategories", { transaction });
    await transaction.commit();
  },
};
