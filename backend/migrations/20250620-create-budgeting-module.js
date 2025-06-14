'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BudgetMonths', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      month: { type: Sequelize.STRING, allowNull: false, unique: true },
      notes: Sequelize.TEXT,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('BudgetLines', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      planned: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      actual: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      is_paid: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_retired: { type: Sequelize.BOOLEAN, defaultValue: false },
      repeats_annually: { type: Sequelize.BOOLEAN, defaultValue: false },
      BudgetMonthId: {
        type: Sequelize.INTEGER,
        references: { model: 'BudgetMonths', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('IncomeSources', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      BudgetMonthId: {
        type: Sequelize.INTEGER,
        references: { model: 'BudgetMonths', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('SavingPots', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      current_value: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('SavingEntries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      value: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      BudgetMonthId: {
        type: Sequelize.INTEGER,
        references: { model: 'BudgetMonths', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      SavingPotId: {
        type: Sequelize.INTEGER,
        references: { model: 'SavingPots', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SavingEntries');
    await queryInterface.dropTable('SavingPots');
    await queryInterface.dropTable('IncomeSources');
    await queryInterface.dropTable('BudgetLines');
    await queryInterface.dropTable('BudgetMonths');
  }
};
