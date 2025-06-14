'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Cars', 'nextTaxDue', { type: Sequelize.DATE });
    await queryInterface.addColumn('Cars', 'nextInsuranceDue', { type: Sequelize.DATE });
    await queryInterface.addColumn('Cars', 'insuranceProviderName', { type: Sequelize.STRING });
    await queryInterface.addColumn('Cars', 'nextMotDue', { type: Sequelize.DATE });
    await queryInterface.addColumn('Cars', 'nextServiceDue', { type: Sequelize.DATE });
    await queryInterface.addColumn('Cars', 'serviceType', { type: Sequelize.STRING });
    await queryInterface.addColumn('Cars', 'lastMileage', { type: Sequelize.INTEGER });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Cars', 'lastMileage');
    await queryInterface.removeColumn('Cars', 'serviceType');
    await queryInterface.removeColumn('Cars', 'nextServiceDue');
    await queryInterface.removeColumn('Cars', 'nextMotDue');
    await queryInterface.removeColumn('Cars', 'insuranceProviderName');
    await queryInterface.removeColumn('Cars', 'nextInsuranceDue');
    await queryInterface.removeColumn('Cars', 'nextTaxDue');
  }
};
