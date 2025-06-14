'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Cars table
    await queryInterface.createTable('Cars', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      make: { type: Sequelize.STRING, allowNull: false },
      model: { type: Sequelize.STRING, allowNull: false },
      year: { type: Sequelize.INTEGER },
      registration: { type: Sequelize.STRING },
      value: { type: Sequelize.DECIMAL(10, 2) },
      notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // MOTs
    await queryInterface.createTable('Mots', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      testDate: { type: Sequelize.DATE, allowNull: false },
      expiryDate: { type: Sequelize.DATE, allowNull: false },
      cost: { type: Sequelize.DECIMAL(10, 2) },
      notes: { type: Sequelize.TEXT },
      CarId: {
        type: Sequelize.INTEGER,
        references: { model: 'Cars', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // Insurances
    await queryInterface.createTable('Insurances', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      provider: {
        type: Sequelize.INTEGER,
        references: { model: 'Vendors', key: 'id' },
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      policyNumber: { type: Sequelize.STRING, allowNull: false },
      expiryDate: { type: Sequelize.DATE, allowNull: false },
      cost: { type: Sequelize.DECIMAL(10, 2) },
      notes: { type: Sequelize.TEXT },
      CarId: {
        type: Sequelize.INTEGER,
        references: { model: 'Cars', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // ServiceRecords
    await queryInterface.createTable('ServiceRecords', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      serviceDate: { type: Sequelize.DATE, allowNull: false },
      mileage: { type: Sequelize.INTEGER },
      cost: { type: Sequelize.DECIMAL(10, 2) },
      serviceType: {
        type: Sequelize.STRING,    // STRING instead of ENUM for SQLite
        allowNull: false,
        defaultValue: 'Full',
      },
      notes: { type: Sequelize.TEXT },
      CarId: {
        type: Sequelize.INTEGER,
        references: { model: 'Cars', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // CarTaxes
    await queryInterface.createTable('CarTaxes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      expiryDate: { type: Sequelize.DATE, allowNull: false },
      cost: { type: Sequelize.DECIMAL(10, 2) },
      notes: { type: Sequelize.TEXT },
      CarId: {
        type: Sequelize.INTEGER,
        references: { model: 'Cars', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // MileageRecords
    await queryInterface.createTable('MileageRecords', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      recordDate: { type: Sequelize.DATE, allowNull: false },
      mileage: { type: Sequelize.INTEGER, allowNull: false },
      CarId: {
        type: Sequelize.INTEGER,
        references: { model: 'Cars', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MileageRecords');
    await queryInterface.dropTable('CarTaxes');
    await queryInterface.dropTable('ServiceRecords');
    await queryInterface.dropTable('Insurances');
    await queryInterface.dropTable('Mots');
    await queryInterface.dropTable('Cars');
    // Removed ENUM drop since SQLite does not use ENUM
  }
};
