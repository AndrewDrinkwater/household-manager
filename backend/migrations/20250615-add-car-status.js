'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Cars', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Active'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Cars', 'status');
  }
};
