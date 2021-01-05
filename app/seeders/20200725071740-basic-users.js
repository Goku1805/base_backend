"use strict";

const uuidv1 = require("uuid/v1");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        uuid: uuidv1(),
        firstName: "Main",
        lastName: "Admin",
        email: "admin@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        userTypeId: 1,
      },
      {
        id: 2,
        uuid: uuidv1(),
        firstName: "First",
        lastName: "Customer",
        email: "first@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        userTypeId: 2,
      },
      {
        id: 3,
        uuid: uuidv1(),
        firstName: "Second",
        lastName: "Customer",
        email: "second@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        userTypeId: 2,
      },
      {
        id: 4,
        uuid: uuidv1(),
        firstName: "First",
        lastName: "Deliveryboy",
        email: "first_delivery@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        userTypeId: 3,
      },
      {
        id: 5,
        uuid: uuidv1(),
        firstName: "Second",
        lastName: "Deliveryboy",
        email: "second_delivery@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        userTypeId: 3,
      },
    ]);

    await queryInterface.bulkInsert("LocalAuths", [
      { id: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, userId: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, userId: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, userId: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, userId: 5, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
