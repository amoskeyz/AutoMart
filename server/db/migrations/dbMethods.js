import pool from '../config/config';
import Util from '../../helper/utilities';


class DbMethods {
  /**
  * @static
  * @description Creates a query that inserts an object into a table
  * @param {string} table - table to be inserted
  * @param {object} object - objects to insert
  * @param {string} returing - Clause to return a value, Optional
  * @memberof Utilities
  */

  static async insertToDb(table, object, returning = '') {
    const insert = Util.insertQuery(table, object, returning);
    const data = await pool.query(insert);
    if (returning !== '') { return data.rows[0]; }
    return data;
  }

  /**
  * @static
  * @description Create a query to read the database
  * @param {string} table - table to be inserted
  * @param {object} specifier - what to be selected
  * @param {string} object - value to be read
  * @memberof Database Controllers
  */

  static async readFromDb(table, specifier, object) {
    const read = `SELECT ${specifier} from ${table} WHERE ${Object.keys(object)} = '${Object.values(object)}'`;
    const data = await pool.query(read);
    return data.rows;
  }
}

export default DbMethods;
