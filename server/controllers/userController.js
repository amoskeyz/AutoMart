import token from '../helper/token';
import users from '../model/user';
import utilities from '../helper/utilities';

class userController {
  static welcome(req, res) {
    return res.status(200).json({
      message: 'Welcome to AutoMart',
    });
  }

  static signupUser(req, res) {
    const {
      firstName, lastName, email, password, phoneNumber,
    } = req.body;

    let isExist = false;
    users.forEach((user) => {
      if (user.email === email) {
        isExist = true;
      }
    });
    if (isExist) {
      return utilities.errorstatus(res, 400, 'User Already Exist');
    }
    const id = users.length + 1;
    const userObj = {
      id, firstName, lastName, email, password, phoneNumber,
    };
    users.push(userObj);
    return utilities.successStatus(res, 201, 'data', {
      Token: token({ id: userObj.id }), id, firstName, lastName, email, password, phoneNumber,
    });
  }

  static signinUser(req, res) {
    const { email, password } = req.body;
    let isUser = false;
    let id;
    let firstName;
    let lastName;
    let phoneNumber;
    users.forEach((user) => {
      if (user.email === email && user.password === password) {
        isUser = true;
        ({
          id, firstName, lastName, phoneNumber,
        } = user);
      }
    });
    if (isUser) {
      return utilities.successStatus(res, 200, 'data', {
        Token: token({ id }), id, firstName, lastName, email, phoneNumber,
      });
    }
    return utilities.errorstatus(res, 400, 'Wrong User details');
  }
}

export default userController;
