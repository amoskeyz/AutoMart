/* eslint-disable no-console */
import pool from '../config/config';

const dropUsersTable = 'DROP TABLE users';

async function deleteTables() {
  try {
    await pool.query(dropUsersTable);
    console.log('Tables deleted');
  } catch (error) {
    console.log('Error dropping Tables');
  }
}

deleteTables();
