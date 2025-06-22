'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HousePlans', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      status: { type: Sequelize.STRING, defaultValue: 'planned' },
      budget: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      actualSpend: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      startDate: { type: Sequelize.DATE },
      endDate: { type: Sequelize.DATE },
      createdBy: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deletedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('HousePlanLineItems', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      title: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      estimate: { type: Sequelize.DECIMAL(10,2) },
      actualSpend: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      startDate: { type: Sequelize.DATE },
      endDate: { type: Sequelize.DATE },
      HousePlanId: {
        type: Sequelize.UUID,
        references: { model: 'HousePlans', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deletedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('HousePlanQuotes', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      vendor: { type: Sequelize.STRING },
      amount: { type: Sequelize.DECIMAL(10,2) },
      dateReceived: { type: Sequelize.DATE },
      notes: { type: Sequelize.TEXT },
      HousePlanLineItemId: {
        type: Sequelize.UUID,
        references: { model: 'HousePlanLineItems', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      attachmentId: { type: Sequelize.INTEGER, references: { model: 'Attachments', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deletedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('HousePlanInvoices', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      vendor: { type: Sequelize.STRING },
      amount: { type: Sequelize.DECIMAL(10,2) },
      dateIssued: { type: Sequelize.DATE },
      paid: { type: Sequelize.BOOLEAN, defaultValue: false },
      HousePlanLineItemId: {
        type: Sequelize.UUID,
        references: { model: 'HousePlanLineItems', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      attachmentId: { type: Sequelize.INTEGER, references: { model: 'Attachments', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deletedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('HousePlanTasks', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      title: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      status: { type: Sequelize.STRING, defaultValue: 'not_started' },
      dueDate: { type: Sequelize.DATE },
      HousePlanLineItemId: {
        type: Sequelize.UUID,
        references: { model: 'HousePlanLineItems', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      assignedTo: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deletedAt: { type: Sequelize.DATE }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HousePlanTasks');
    await queryInterface.dropTable('HousePlanInvoices');
    await queryInterface.dropTable('HousePlanQuotes');
    await queryInterface.dropTable('HousePlanLineItems');
    await queryInterface.dropTable('HousePlans');
  }
};
