import token from '../helper/token';
import utilities from '../helper/utilities';
import secure from '../helper/encrypt';
import dbMethods from '../db/migrations/dbMethods';


class userController {
  static welcome(req, res) {
    return res.status(200).json({
      message: 'Welcome to AutoMart',
    });
  }

  static async signupUser(req, res) {
    try {
      const {
        firstName, lastName, email, password, phoneNumber,
      } = req.body;

      const user = await dbMethods.readFromDb('users', '*', { email });

      if (user[0]) {
        return utilities.errorstatus(res, 400, 'User Already Exist');
      }
      const isAdmin = false;
      const hashpassword = secure.passwordhash(password);

      const fetchedUser = await dbMethods.insertToDb('users', {
        firstName, lastName, email, hashpassword, isAdmin, phoneNumber,
      }, 'RETURNING id');

      const { id } = fetchedUser;

      return utilities.successStatus(res, 201, 'data', {
        token: token({ id: fetchedUser.id }), id, firstName, lastName, email, phoneNumber,
      });
    } catch (err) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }
}

export default userController;
