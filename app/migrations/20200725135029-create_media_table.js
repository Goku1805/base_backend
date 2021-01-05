"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Media", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV1,
        unique: true,
        validate: {
          notNull: true,
        },
      },
      mimeType: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      asset: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      imageWidth: {
        type: Sequelize.INTEGER,
        defaultValue: false,
      },
      imageHeight: {
        type: Sequelize.INTEGER,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Users",
          key: "id",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    await queryInterface.dropTable("Media", { transaction });
    await transaction.commit();
  },
};
