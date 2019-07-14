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
        first_name, last_name, email, password, address,
      } = req.body;

      const user = await dbMethods.readFromDb('users', '*', { email });

      if (user[0]) {
        return utilities.errorstatus(res, 400, 'User Already Exist');
      }
      const is_admin = false;
      const hashpassword = secure.passwordhash(password);

      const fetchedUser = await dbMethods.insertToDb('users', {
        first_name, last_name, email, hashpassword, is_admin, address,
      }, 'RETURNING id');

      const { id } = fetchedUser;

      return utilities.successStatus(res, 201, 'data', {
        token: token({ id: fetchedUser.id }), id, first_name, last_name, email, address,
      });
    } catch (err) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async signinUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await dbMethods.readFromDb('users', '*', { email });

      if (!user[0]) {
        return utilities.errorstatus(res, 400, 'Invalid User');
      }

      const passwordcheck = secure.compare(password, user[0].hashpassword);

      if (passwordcheck) {
        const {
          id, first_name, last_name, address,
        } = user[0];

        return utilities.successStatus(res, 200, 'data', {
          token: token({ id }),
          id,
          first_name,
          last_name,
          email,
          address,
        });
      }

      return utilities.errorstatus(res, 400, 'Incorrect Password or Email');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async getUser(req, res) {
    try {
      const { email } = req.body;

      const user = await dbMethods.readFromDb('users', '*', { email });

      if (!user[0]) {
        return utilities.errorstatus(res, 400, 'Invalid User');
      }
      const {
        id, firstname, lastname, phonenumber, profilepic,
      } = user[0];

      return utilities.successStatus(res, 200, 'data', {
        id,
        firstName: firstname,
        lastName: lastname,
        email,
        phoneNumber: phonenumber,
        profilepic,
      });
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }
}

export default userController;
