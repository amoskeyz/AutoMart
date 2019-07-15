import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';

dotenv.config();

class authenticator {
  static async authenticateUser(req, res, next) {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.status(401).json({
          status: 'Error',
          error: 'Authorization Error',
        });
      }
      const verify = jwt.verify(token, process.env.secretKey, (err, decoded) => decoded);
      req.decoder = verify.id;
      const isUser = await dbMethods.readFromDb('users', '*', { id: verify.id });
      if (!isUser[0]) {
        return Utilities.errorstatus(res, 401, 'Unauthorise User, Please Sign Up');
      }
      req.user = { id: isUser[0].id, email: isUser[0].email, isAdmin: isUser[0].is_admin };
      console.log(req.body, '=====> body');
      console.log(req.params, '====> params');
      return next();
    } catch (error) {
      return Utilities.errorstatus(res, 401, 'Unauthorization User');
    }
  }

  static isUser(req, res, next) {
    const { isAdmin } = req.user;
    if (isAdmin) {
      return Utilities.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
    }
    return next();
  }

  static isAdmin(req, res, next) {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return Utilities.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
    }
    return next();
  }
}


export default authenticator;
