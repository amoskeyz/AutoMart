/* eslint-disable no-console */
import pool from '../config/config';

const dropUsersTable = 'DROP TABLE users';
const dropCarsTable = 'DROP TABLE cars';

async function deleteTables() {
  try {
    await pool.query(dropUsersTable);
    await pool.query(dropCarsTable);
    console.log('Tables deleted');
  } catch (error) {
    console.log('Error dropping Tables');
  }
}

deleteTables();
