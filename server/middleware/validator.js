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

  /**
  * @static
  * @description Validates a car input request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static validateCar(req, res, next) {
    const {
      manufacturer, model, bodyType, price, state,
    } = req.body;

    const validateObject = {
      manufacturer, model, bodyType, price, state,
    };

    const error = util.validateJoi(validateObject, schema.car);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.manufacturer = manufacturer.trim();
    req.body.model = model.trim();
    req.body.bodyType = bodyType.trim();
    req.body.state = state.trim();
    if (Number(req.body.price) < 0) return util.errorstatus(res, 400, 'Price must Not be Negative');
    return next();
  }

  /**
  * @static
  * @description Validates a purchase order request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateOrder(req, res, next) {
    const { priceOffered } = req.body;
    const validateObject = { priceOffered };
    const error = util.validateJoi(validateObject, schema.order);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    if (Number(req.body.priceOffered) < 0) return util.errorstatus(res, 400, 'Price must Not be Negative');
    return next();
  }

  /**
  * @static
  * @description Validates a update order price request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateUpdateOrder(req, res, next) {
    const { newPriceOffered } = req.body;
    const validateObject = { newPriceOffered };
    const error = util.validateJoi(validateObject, schema.updateOrder);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    if (Number(req.body.newPriceOffered) < 0) return util.errorstatus(res, 400, 'Price must Not be Negative');
    return next();
  }

  /**
  * @static
  * @description Validates a update car price request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateUpdateCar(req, res, next) {
    const { price } = req.body;
    const validateObject = { price };
    const error = util.validateJoi(validateObject, schema.updateCar);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    if (Number(req.body.price) < 0) return util.errorstatus(res, 400, 'Price must Not be Negative');
    return next();
  }

  /**
  * @static
  * @description Validates a get all unsold car request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateGetCar(req, res, next) {
    const {
      // eslint-disable-next-line camelcase
      status, min_price, max_price,
    } = req.query;
    const validateObject = {
      status, min_price, max_price,
    };
    const error = util.validateJoi(validateObject, schema.getCar);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    return next();
  }

  /**
  * @static
  * @description Validates a car id request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateCarId(req, res, next) {
    const { carId } = req.params;
    const validateObject = { carId };
    const error = util.validateJoi(validateObject, schema.carId);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    return next();
  }
}

export default validate;
