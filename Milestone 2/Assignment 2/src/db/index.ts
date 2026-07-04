import { Pool } from 'pg';
import config from '../config';

const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseUrl?.includes('neon') || config.databaseUrl?.includes('supabase') || isProduction
    ? { rejectUnauthorized: false }
    : undefined,
});

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params);
};

export const initDB = async () => {
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully.');

    // Initialize users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table checked/created.');

    // Initialize issues table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) CHECK (type IN ('bug', 'feature_request')) NOT NULL,
        status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Issues table checked/created.');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    // Don't crash the server during build/Vercel initialization where DB URL may not be present
    if (isProduction) {
      console.warn('Proceeding anyway because we are in production build/start context');
    } else {
      process.exit(1);
    }
  }
};
