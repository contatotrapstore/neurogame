const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PlanGame = sequelize.define('PlanGame', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'plan_id',
    references: {
      model: 'subscription_plans',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  gameId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'game_id',
    references: {
      model: 'games',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'plan_games',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['plan_id', 'game_id'], unique: true }
  ]
});

module.exports = PlanGame;
