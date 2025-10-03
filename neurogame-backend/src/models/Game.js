const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9-]+$/i
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coverImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cover_image'
  },
  folderPath: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'folder_path'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Educacional'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'games',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['category'] },
    { fields: ['is_active'] }
  ]
});

module.exports = Game;
