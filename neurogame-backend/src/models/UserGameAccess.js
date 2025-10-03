const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserGameAccess = sequelize.define('UserGameAccess', {
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
  grantedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'granted_at'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
  },
  grantedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'granted_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'user_game_access',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'game_id'], unique: true }
  ]
});

module.exports = UserGameAccess;
