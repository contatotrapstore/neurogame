const { sequelize, testConnection } = require('../config/database');
const { User, Game, SubscriptionPlan, PlanGame } = require('../models');
require('dotenv').config();

const gamesData = [
  {
    name: 'Autorama',
    slug: 'autorama',
    description: 'Jogo de corrida emocionante em pista de autorama. Controle seu carro e vença a corrida!',
    folderPath: 'Jogos/autorama',
    category: 'Corrida',
    order: 1
  },
  {
    name: 'Balão',
    slug: 'balao',
    description: 'Controle um balão de ar quente e navegue pelos céus evitando obstáculos.',
    folderPath: 'Jogos/balao',
    category: 'Aventura',
    order: 2
  },
  {
    name: 'Batalha de Tanques',
    slug: 'batalhadetanques',
    description: 'Combate estratégico com tanques. Destrua seus oponentes e domine o campo de batalha!',
    folderPath: 'Jogos/batalhadetanques',
    category: 'Ação',
    order: 3
  },
  {
    name: 'Correndo pelos Trilhos',
    slug: 'correndopelostrilhos',
    description: 'Conduza um trem pelos trilhos, colete itens e evite obstáculos.',
    folderPath: 'Jogos/correndopelostrilhos',
    category: 'Corrida',
    order: 4
  },
  {
    name: 'Desafio Aéreo',
    slug: 'desafioaereo',
    description: 'Pilote um avião em missões desafiadoras pelos céus.',
    folderPath: 'Jogos/desafioaereo',
    category: 'Simulação',
    order: 5
  },
  {
    name: 'Desafio Automotivo',
    slug: 'desafioautomotivo',
    description: 'Corrida automotiva com veículos variados. Mostre suas habilidades de pilotagem!',
    folderPath: 'Jogos/desafioautomotivo',
    category: 'Corrida',
    order: 6
  },
  {
    name: 'Desafio nas Alturas',
    slug: 'desafionasalturas',
    description: 'Escale montanhas e supere desafios em grandes alturas.',
    folderPath: 'Jogos/desafionasalturas',
    category: 'Aventura',
    order: 7
  },
  {
    name: 'Fazendinha',
    slug: 'fazendinha',
    description: 'Gerencie sua própria fazenda, plante, colha e cuide dos animais.',
    folderPath: 'Jogos/fazendinha',
    category: 'Simulação',
    order: 8
  },
  {
    name: 'Labirinto',
    slug: 'labirinto',
    description: 'Navegue por labirintos complexos e encontre a saída.',
    folderPath: 'Jogos/labirinto',
    category: 'Puzzle',
    order: 9
  },
  {
    name: 'Missão Espacial',
    slug: 'missaoespacial',
    description: 'Explore o espaço sideral em missões emocionantes entre planetas e galáxias.',
    folderPath: 'Jogos/missaoespacial',
    category: 'Aventura',
    order: 10
  },
  {
    name: 'Resgate em Chamas',
    slug: 'resgateemchamas',
    description: 'Missão heroica de resgate em situações de emergência com fogo.',
    folderPath: 'Jogos/resgateemchamas',
    category: 'Ação',
    order: 11
  },
  {
    name: 'Taxi City',
    slug: 'taxicity',
    description: 'Seja um motorista de táxi e transporte passageiros pela cidade.',
    folderPath: 'Jogos/taxicity',
    category: 'Simulação',
    order: 12
  },
  {
    name: 'Tesouro do Mar',
    slug: 'tesourodomar',
    description: 'Aventura submarina em busca de tesouros perdidos nas profundezas do oceano.',
    folderPath: 'Jogos/tesourodomar',
    category: 'Aventura',
    order: 13
  }
];

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const [admin, adminCreated] = await User.findOrCreate({
      where: { username: process.env.ADMIN_USERNAME || 'admin' },
      defaults: {
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@neurogame.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        fullName: 'Administrator',
        isAdmin: true
      }
    });

    if (adminCreated) {
      console.log(`✅ Admin user created: ${admin.username}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${admin.username}`);
    }

    // Create demo user
    console.log('\n👤 Creating demo user...');
    const [demoUser, demoCreated] = await User.findOrCreate({
      where: { username: 'demo' },
      defaults: {
        username: 'demo',
        email: 'demo@neurogame.com',
        password: 'Demo@123456',
        fullName: 'Demo User',
        isAdmin: false
      }
    });

    if (demoCreated) {
      console.log(`✅ Demo user created: ${demoUser.username}`);
    } else {
      console.log(`ℹ️  Demo user already exists: ${demoUser.username}`);
    }

    // Create games
    console.log('\n🎮 Creating games...');
    const createdGames = [];
    for (const gameData of gamesData) {
      const [game, created] = await Game.findOrCreate({
        where: { slug: gameData.slug },
        defaults: gameData
      });

      createdGames.push(game);

      if (created) {
        console.log(`✅ Game created: ${game.name}`);
      } else {
        console.log(`ℹ️  Game already exists: ${game.name}`);
      }
    }

    // Create subscription plans
    console.log('\n💰 Creating subscription plans...');

    // Basic Plan - 5 games
    const [basicPlan, basicCreated] = await SubscriptionPlan.findOrCreate({
      where: { name: 'Plano Básico' },
      defaults: {
        name: 'Plano Básico',
        description: 'Acesso a 5 jogos selecionados - ideal para começar!',
        price: 19.90,
        durationDays: 30,
        features: ['5 jogos inclusos', 'Atualizações automáticas', 'Suporte por email']
      }
    });

    if (basicCreated) {
      console.log(`✅ Plan created: ${basicPlan.name}`);
      // Associate first 5 games
      const basicGames = createdGames.slice(0, 5);
      for (const game of basicGames) {
        await PlanGame.findOrCreate({
          where: { planId: basicPlan.id, gameId: game.id }
        });
      }
      console.log(`   ↳ ${basicGames.length} games associated`);
    } else {
      console.log(`ℹ️  Plan already exists: ${basicPlan.name}`);
    }

    // Premium Plan - All games
    const [premiumPlan, premiumCreated] = await SubscriptionPlan.findOrCreate({
      where: { name: 'Plano Premium' },
      defaults: {
        name: 'Plano Premium',
        description: 'Acesso completo a todos os jogos da plataforma!',
        price: 39.90,
        durationDays: 30,
        features: [
          'Todos os jogos inclusos',
          'Atualizações automáticas',
          'Suporte prioritário',
          'Novos jogos incluídos automaticamente'
        ]
      }
    });

    if (premiumCreated) {
      console.log(`✅ Plan created: ${premiumPlan.name}`);
      // Associate all games
      for (const game of createdGames) {
        await PlanGame.findOrCreate({
          where: { planId: premiumPlan.id, gameId: game.id }
        });
      }
      console.log(`   ↳ ${createdGames.length} games associated`);
    } else {
      console.log(`ℹ️  Plan already exists: ${premiumPlan.name}`);
    }

    // Educational Plan - Custom selection
    const [eduPlan, eduCreated] = await SubscriptionPlan.findOrCreate({
      where: { name: 'Plano Educacional' },
      defaults: {
        name: 'Plano Educacional',
        description: 'Plano personalizado para instituições de ensino',
        price: 99.90,
        durationDays: 90,
        features: [
          'Acesso personalizado',
          'Gestão de múltiplos usuários',
          'Relatórios de uso',
          'Suporte dedicado'
        ]
      }
    });

    if (eduCreated) {
      console.log(`✅ Plan created: ${eduPlan.name}`);
      // Associate puzzle and simulation games
      const eduGames = createdGames.filter(g =>
        ['Puzzle', 'Simulação'].includes(g.category)
      );
      for (const game of eduGames) {
        await PlanGame.findOrCreate({
          where: { planId: eduPlan.id, gameId: game.id }
        });
      }
      console.log(`   ↳ ${eduGames.length} games associated`);
    } else {
      console.log(`ℹ️  Plan already exists: ${eduPlan.name}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${adminCreated || demoCreated ? 2 : 'existing'}`);
    console.log(`   Games: ${createdGames.length}`);
    console.log(`   Plans: 3`);
    console.log('\n🔐 Admin Credentials:');
    console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\n🔐 Demo Credentials:');
    console.log(`   Username: demo`);
    console.log(`   Password: Demo@123456\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
