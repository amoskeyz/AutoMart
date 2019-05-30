import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import users from '../model/user';

dotenv.config();

class authenticator {
  static authenticateUser(req, res, next) {
    const token = req.headers.authtoken;
    if (!token) {
      return res.status(401).json({
        status: 'Error',
        error: 'Authorization Error',
      });
    }
    const verify = jwt.verify(token, process.env.secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'Error',
          error: 'Unauthorized user',
        });
      }
      return decoded;
    });
    req.decoder = verify.id;
    const isUser = users.filter(user => user.id === req.decoder);
    req.user = isUser;
    return next();
  }
}

export default authenticator;
