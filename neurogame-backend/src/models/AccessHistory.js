const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AccessHistory = sequelize.define('AccessHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
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
  },
  accessedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'accessed_at'
  },
  sessionDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'session_duration',
    comment: 'Duration in seconds'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address'
  }
}, {
  tableName: 'access_history',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['game_id'] },
    { fields: ['accessed_at'] }
  ]
});

module.exports = AccessHistory;
