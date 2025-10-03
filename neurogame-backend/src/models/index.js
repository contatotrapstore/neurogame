const User = require('./User');
const Game = require('./Game');
const SubscriptionPlan = require('./SubscriptionPlan');
const UserSubscription = require('./UserSubscription');
const PlanGame = require('./PlanGame');
const UserGameAccess = require('./UserGameAccess');
const AccessHistory = require('./AccessHistory');

// Define associations

// User <-> UserSubscription (One-to-Many)
User.hasMany(UserSubscription, { foreignKey: 'userId', as: 'subscriptions' });
UserSubscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// SubscriptionPlan <-> UserSubscription (One-to-Many)
SubscriptionPlan.hasMany(UserSubscription, { foreignKey: 'planId', as: 'subscriptions' });
UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: 'planId', as: 'plan' });

// SubscriptionPlan <-> Game (Many-to-Many through PlanGame)
SubscriptionPlan.belongsToMany(Game, {
  through: PlanGame,
  foreignKey: 'planId',
  otherKey: 'gameId',
  as: 'games'
});
Game.belongsToMany(SubscriptionPlan, {
  through: PlanGame,
  foreignKey: 'gameId',
  otherKey: 'planId',
  as: 'plans'
});

// User <-> Game (Many-to-Many through UserGameAccess - individual access)
User.belongsToMany(Game, {
  through: UserGameAccess,
  foreignKey: 'userId',
  otherKey: 'gameId',
  as: 'accessibleGames'
});
Game.belongsToMany(User, {
  through: UserGameAccess,
  foreignKey: 'gameId',
  otherKey: 'userId',
  as: 'authorizedUsers'
});

// User <-> AccessHistory (One-to-Many)
User.hasMany(AccessHistory, { foreignKey: 'userId', as: 'history' });
AccessHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Game <-> AccessHistory (One-to-Many)
Game.hasMany(AccessHistory, { foreignKey: 'gameId', as: 'accessLogs' });
AccessHistory.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

module.exports = {
  User,
  Game,
  SubscriptionPlan,
  UserSubscription,
  PlanGame,
  UserGameAccess,
  AccessHistory
};
