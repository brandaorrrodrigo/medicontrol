const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  console.log('🚀 MedicControl - Database Setup');
  console.log('================================\n');

  // Extrair connection string do .env
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env file!');
    process.exit(1);
  }

  // Parse connection string
  const url = new URL(connectionString);
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const databaseName = url.pathname.slice(1).split('?')[0]; // Remove barra e query params

  console.log(isLocal ? '📡 Connecting to local PostgreSQL...' : '📡 Connecting to remote PostgreSQL...');

  console.log('🔍 Connection details:');
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port}`);
  console.log(`   Database: ${databaseName}`);
  console.log(`   Username: ${url.username}`);
  console.log(`   Password: ${'*'.repeat(url.password.length)}\n`);

  // Para conexão local, primeiro verificar/criar banco no database 'postgres'
  if (isLocal) {
    console.log('🔧 Setting up local database...');

    const adminClient = new Client({
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: parseInt(url.port),
      database: 'postgres' // Conectar ao banco default
    });

    try {
      await adminClient.connect();
      console.log('✅ Connected to postgres database\n');

      // Verificar se o banco existe
      const checkDb = await adminClient.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [databaseName]
      );

      if (checkDb.rows.length === 0) {
        console.log(`📦 Creating database "${databaseName}"...`);
        await adminClient.query(`CREATE DATABASE ${databaseName}`);
        console.log('✅ Database created!\n');
      } else {
        console.log(`✅ Database "${databaseName}" already exists\n`);
      }

    } catch (error) {
      console.error('❌ Error setting up database:', error.message);
      throw error;
    } finally {
      await adminClient.end();
    }
  }

  // Conectar ao banco final
  const client = new Client({
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port),
    database: databaseName,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  });

  try {
    // Conectar
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Criar extensões necessárias
    console.log('🔧 Creating PostgreSQL extensions...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ Extension "uuid-ossp" created/verified\n');

    // Verificar se já existem tabelas
    console.log('🔍 Checking existing tables...');
    const result = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    if (result.rows.length > 0) {
      console.log(`\n✅ Found ${result.rows.length} existing tables:\n`);
      result.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.tablename}`);
      });
      console.log('\n⚠️  Database already has tables.');
    } else {
      console.log('📦 No tables found - database is ready for migrations\n');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run migrations: npx prisma migrate dev');
    console.log('   2. Generate Prisma Client: npx prisma generate');
    console.log('   3. Seed database (optional): npm run prisma:seed');
    console.log('   4. Start backend: npm run dev');
    console.log('   5. Start frontend: cd ../frontend && npm run dev\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Executar
setupDatabase();
