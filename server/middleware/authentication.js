import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';

dotenv.config();

class authenticator {
  static async authenticateUser(req, res, next) {
    try {
      const token = req.headers.authtoken;
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
      req.user = { id: isUser[0].id, email: isUser[0].email, isAdmin: isUser[0].isadmin };
      return next();
    } catch (error) {
      return Utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }
}


export default authenticator;
