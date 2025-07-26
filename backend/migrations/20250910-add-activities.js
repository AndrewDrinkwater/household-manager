'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Activities', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      name: { type: Sequelize.STRING, allowNull: false },
      description: Sequelize.TEXT,
      defaultPriceLevel: Sequelize.INTEGER,
      defaultIndoorOutdoor: Sequelize.ENUM('indoor', 'outdoor', 'both'),
      defaultEducationalValue: Sequelize.ENUM('low', 'medium', 'high'),
      isHomeBased: { type: Sequelize.BOOLEAN, defaultValue: false },
      physicalDemand: Sequelize.ENUM('low', 'medium', 'high'),
      lastChosenDate: Sequelize.DATE,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('Locations', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      name: { type: Sequelize.STRING, allowNull: false },
      address: Sequelize.STRING,
      milesFromHome: Sequelize.DECIMAL(10,2),
      tags: Sequelize.TEXT,
      websiteUrl: Sequelize.STRING,
      isClosed: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('ActivityLocations', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      ActivityId: {
        type: Sequelize.UUID,
        references: { model: 'Activities', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      LocationId: {
        type: Sequelize.UUID,
        references: { model: 'Locations', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      priceLevelOverride: Sequelize.INTEGER,
      indoorOutdoorOverride: Sequelize.ENUM('indoor', 'outdoor', 'both'),
      educationalValueOverride: Sequelize.ENUM('low', 'medium', 'high'),
      notes: Sequelize.TEXT,
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ActivityLocations');
    await queryInterface.dropTable('Locations');
    await queryInterface.dropTable('Activities');
  }
};
