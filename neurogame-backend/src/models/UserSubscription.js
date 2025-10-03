const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSubscription = sequelize.define('UserSubscription', {
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
  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'plan_id',
    references: {
      model: 'subscription_plans',
      key: 'id'
    },
    onDelete: 'RESTRICT'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'auto_renew'
  }
}, {
  tableName: 'user_subscriptions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['plan_id'] },
    { fields: ['end_date'] }
  ]
});

module.exports = UserSubscription;
