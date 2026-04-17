import pg from 'pg';
const { Pool } = pg;

// 1. Check if we are in production
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 2. Only apply SSL if we are on Railway (production)
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export default pool;
