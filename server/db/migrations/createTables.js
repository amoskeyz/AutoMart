/* eslint-disable no-console */
import pool from '../config/config';
import users from '../../model/user';
import cars from '../../model/cars';
import orders from '../../model/order';
import Util from '../../helper/utilities';
import flags from '../../model/flags';

function insertMultiple(table, array, returning = '') {
  let insert = '';
  array.forEach((element) => {
    insert += Util.insertQuery(table, element, returning);
  });
  return insert;
}

const usersTable = `CREATE TABLE IF NOT EXISTS users(
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  hashpassword text NOT NULL,
  address text, 
  is_admin boolean NOT NULL,
  profile_pic text DEFAULT 'http://res.cloudinary.com/amoslv/image/upload/v1562438896/ytgtpwvbaw5ew8x8fwsb.png'
  );
`;

const carsTable = `CREATE TABLE IF NOT EXISTS cars(
  id serial PRIMARY KEY,
  owner int NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  manufacturer text NOT NULL,
  model text NOT NULL,
  body_type text NOT NULL,
  price text NOT NULL,
  state text NOT NULL, 
  status text NOT NULL,
  car_image text
  );
`;

const ordersTable = `CREATE TABLE IF NOT EXISTS orders(
  id serial PRIMARY KEY,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  buyer_id text NOT NULL,
  car_id text NOT NULL,
  status text NOT NULL,
  price text NOT NULL,
  price_offered text NOT NULL,
  old_price_offered text,
  new_price_offered text 
  );
`;

const flagsTable = `CREATE TABLE IF NOT EXISTS flags(
  id serial PRIMARY KEY,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  car_id text NOT NULL,
  reason text NOT NULL,
  description text NOT NULL
  );
`;
// DEFAULT 'http://res.cloudinary.com/amoslv/image/upload/v1562770121/p09iwdyzfz2u8b4mtf9d.jpg'

async function create() {
  try {
    console.log('seeding database...');
    const createTable = `${usersTable}${carsTable}${ordersTable}${flagsTable}`;

    await pool.query(createTable);

    await pool.query(insertMultiple('users', users));
    await pool.query(insertMultiple('cars', cars));
    await pool.query(insertMultiple('orders', orders));
    await pool.query(insertMultiple('flags', flags));

    console.log('created all tables ');
  } catch (error) {
    console.log(error);
  }
}

create();
console.log('seeding successful');
