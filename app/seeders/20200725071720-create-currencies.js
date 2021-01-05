'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Currencies', [
      {
        slug: 'inr',
        name: 'Indian Rupees',
        symbol: '₹',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Currencies', null, {});
  }
};
