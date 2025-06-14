'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BudgetMonths', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      month: { type: Sequelize.STRING, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('BudgetLines', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      is_retired: { type: Sequelize.BOOLEAN, defaultValue: false },
      repeats_annually: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('BudgetEntries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      BudgetMonthId: {
        type: Sequelize.INTEGER,
        references: { model: 'BudgetMonths', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      BudgetLineId: {
        type: Sequelize.INTEGER,
        references: { model: 'BudgetLines', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      planned_amount: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      actual_amount: { type: Sequelize.DECIMAL(10,2) },
      is_paid: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_changed_after_start: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('IncomeSources', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      BudgetMonthId: {
        type: Sequelize.INTEGER,
        references: { model: 'BudgetMonths', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('SavingsPots', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('SavingsEntries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      SavingsPotId: {
        type: Sequelize.INTEGER,
        references: { model: 'SavingsPots', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      BudgetMonthId: {
        type: Sequelize.INTEGER,
        references: { model: 'BudgetMonths', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      amount: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SavingsEntries');
    await queryInterface.dropTable('SavingsPots');
    await queryInterface.dropTable('IncomeSources');
    await queryInterface.dropTable('BudgetEntries');
    await queryInterface.dropTable('BudgetLines');
    await queryInterface.dropTable('BudgetMonths');
  }
};
