/* eslint-disable no-console */
import pool from '../config/config';

const dropUsersTable = 'DROP TABLE users';
const dropCarsTable = 'DROP TABLE cars';
const dropOrdersTable = 'DROP TABLE orders';

async function deleteTables() {
  try {
    await pool.query(dropUsersTable);
    await pool.query(dropCarsTable);
    await pool.query(dropOrdersTable);
    await pool.query('DROP TABLE flags');
    console.log('Tables deleted');
  } catch (error) {
    console.log('Error dropping Tables');
  }
}

deleteTables();
