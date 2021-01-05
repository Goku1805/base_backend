"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("UserProfiles", [
      {
        userId: 1,
        dob: new Date(1994, 6, 9),
        phone: "123456789",
        profilePicId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        dob: new Date(1994, 6, 9),
        phone: "123456789",
        profilePicId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        dob: new Date(1994, 6, 9),
        userId: 3,
        phone: "123456789",
        profilePicId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        dob: new Date(1994, 6, 9),
        phone: "123456789",
        profilePicId: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        dob: new Date(1994, 6, 9),
        phone: "123456789",
        profilePicId: 100,
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
    return queryInterface.bulkDelete("UserProfiles", null, {});
  },
};
