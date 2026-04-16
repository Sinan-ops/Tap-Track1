import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/tap_track',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
