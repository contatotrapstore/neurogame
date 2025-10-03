const { sequelize, testConnection } = require('../config/database');
const models = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...\n');

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Sync all models
    await sequelize.sync({ force: false, alter: true });

    console.log('\n✅ Database migration completed successfully!');
    console.log('📋 Models synchronized:');
    console.log('   - Users');
    console.log('   - Games');
    console.log('   - SubscriptionPlans');
    console.log('   - UserSubscriptions');
    console.log('   - PlanGames');
    console.log('   - UserGameAccess');
    console.log('   - AccessHistory\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
