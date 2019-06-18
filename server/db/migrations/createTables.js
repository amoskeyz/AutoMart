/* eslint-disable no-console */
import pool from '../config/config';
import users from '../../model/user';
import cars from '../../model/cars';
import orders from '../../model/order';
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
  isadmin boolean NOT NULL,
  profilepic text DEFAULT 'https://i.imgur.com/jIsCgyA.jpg'
  );
`;

const carsTable = `CREATE TABLE IF NOT EXISTS cars(
  id serial PRIMARY KEY,
  email text NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  manufacturer text NOT NULL,
  model text NOT NULL,
  bodytype text NOT NULL,
  price text NOT NULL,
  state text NOT NULL, 
  status text NOT NULL,
  carimage text DEFAULT 'https://i.imgur.com/jIsCgyA.jpg'
  );
`;

const ordersTable = `CREATE TABLE IF NOT EXISTS orders(
  id serial PRIMARY KEY,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  buyerid text NOT NULL,
  carid text NOT NULL,
  status text NOT NULL,
  price text NOT NULL,
  priceOffered text NOT NULL
  );
`;


async function create() {
  try {
    console.log('seeding database...');
    const createTable = `${usersTable}${carsTable}${ordersTable}`;

    await pool.query(createTable);

    await pool.query(insertMultiple('users', users));
    await pool.query(insertMultiple('cars', cars));
    await pool.query(insertMultiple('orders', orders));
    console.log('created all tables ');
  } catch (error) {
    console.log(error);
  }
}

create();
console.log('seeding successful');
