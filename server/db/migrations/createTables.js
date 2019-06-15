/* eslint-disable no-console */
import pool from '../config/config';
import users from '../../model/user';
import Util from '../../helper/utilities';

function insertMultiple(table, array, returning = '') {
  let insert = '';
  array.forEach((element) => {
    insert += Util.insertQuery(table, element, returning);
  });
  return insert;
}

const usersTable = `CREATE TABLE IF NOT EXISTS users(
  id serial PRIMARY KEY,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  hashpassword text NOT NULL,
  phonenumber text, 
  isadmin text NOT NULL,
  profilepic text DEFAULT 'https://i.imgur.com/jIsCgyA.jpg'
  );
`;


async function create() {
  try {
    console.log('seeding database...');
    const createTable = `${usersTable}`;

    await pool.query(createTable);

    await pool.query(insertMultiple('users', users));
    console.log('created all tables ');
  } catch (error) {
    console.log(error);
  }
}

create();
console.log('seeding successful');
