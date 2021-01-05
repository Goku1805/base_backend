"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("UserTypes", [
      {
        title: "Admin",
        slug: "admin",
        description: "User that is able to do anything",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Buyer",
        slug: "buyer",
        description: "User that is able buy products from sellers.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Seller",
        slug: "seller",
        description: "User that sells products",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
      */
    return queryInterface.bulkDelete("UserTypes", null, {});
  },
};
