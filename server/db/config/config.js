import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = {
  test: process.env.DB_TEST_URL,
  production: process.env.DB_CONNECTIONSTRING,
};
const pool = new Pool({
  connectionString: connectionString[process.env.NODE_ENV],
});

export default pool;
