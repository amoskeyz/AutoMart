import token from '../helper/token';
import users from '../model/user';
import utilities from '../helper/utilities';
import secure from '../helper/encrypt';

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
    const passwordHash = secure.passwordhash(password);

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
      id, firstName, lastName, email, passwordHash, phoneNumber,
    };
    users.push(userObj);
    return utilities.successStatus(res, 201, 'data', {
      Token: token({ id: userObj.id }), id, firstName, lastName, email, passwordHash, phoneNumber,
    });
  }

  static signinUser(req, res) {
    const { email, password } = req.body;
    let isUser = false;
    let id;
    let firstName;
    let lastName;
    let phoneNumber;
    let passwordcheck;
    users.forEach((user) => {
      if (user.email === email) {
        isUser = true;
        ({
          id, firstName, lastName, phoneNumber,
        } = user);
        passwordcheck = secure.compare(password, user.passwordHash);
      }
    });
    if (isUser && passwordcheck) {
      return utilities.successStatus(res, 200, 'data', {
        Token: token({ id }), id, firstName, lastName, email, phoneNumber,
      });
    }
    return utilities.errorstatus(res, 400, 'Incorrect Password or Email');
  }
}

export default userController;
