import schema from '../helper/schema';
import util from '../helper/utilities';

class validate {
  /**
  * @static
  * @description Validates a signup request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateSignup(req, res, next) {
    const {
      firstName, lastName, email, password, phoneNumber,
    } = req.body;

    const validateObject = {
      firstName, lastName, email, password, phoneNumber,
    };

    const error = util.validateJoi(validateObject, schema.signup);
    if (error) {
      return util.errorstatus(res, 400, error);
    }

    req.body.firstName = firstName.trim();
    req.body.lastName = lastName.trim();
    req.body.password = password.trim();
    req.body.email = email.toLowerCase().trim();
    return next();
  }

  /**
  * @static
  * @description Validates a signin request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateSignin(req, res, next) {
    const {
      email, password,
    } = req.body;

    const validateObject = {
      email, password,
    };

    const error = util.validateJoi(validateObject, schema.signin);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.password = password.trim();
    req.body.email = email.toLowerCase().trim();
    return next();
  }
}

export default validate;
