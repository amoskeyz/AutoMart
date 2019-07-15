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
      first_name, last_name, email, password, address,
    } = req.body;

    const validateObject = {
      first_name, last_name, email, password, address,
    };

    const error = util.validateJoi(validateObject, schema.signup);
    if (error) {
      return util.errorstatus(res, 400, error);
    }

    req.body.first_name = first_name.trim();
    req.body.last_name = last_name.trim();
    req.body.password = password.trim();
    req.body.email = email.toLowerCase().trim();
    req.body.address = address.trim();

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

  static validateUser(req, res, next) {
    const {
      email,
    } = req.body;

    const validateObject = {
      email,
    };

    const error = util.validateJoi(validateObject, schema.user);

    if (error) {
      return util.errorstatus(res, 400, error);
    }
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
      manufacturer, model, body_type, price, state,
    } = req.body;

    const validateObject = {
      manufacturer, model, body_type, price, state,
    };

    const error = util.validateJoi(validateObject, schema.car);
    if (error) {
      return util.errorstatus(res, 400, error);
    }

    req.body.manufacturer = manufacturer.trim();
    req.body.model = model.trim();
    req.body.body_type = body_type.trim();
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
    const { amount, car_id } = req.body;
    const validateObject = { amount, car_id };

    const error = util.validateJoi(validateObject, schema.order);

    if (error) {
      return util.errorstatus(res, 400, error);
    }

    if (Number(req.body.amount) < 0) return util.errorstatus(res, 400, 'Amount Must Not be Negative');
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
    const { price } = req.body;
    const validateObject = { price };

    const error = util.validateJoi(validateObject, schema.updateOrder);

    if (error) {
      return util.errorstatus(res, 400, error);
    }

    if (Number(req.body.price) < 0) return util.errorstatus(res, 400, 'Price must Not be Negative');
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

  static validateSold(req, res, next) {
    const { status } = req.body;
    const validateObject = { status };

    const error = util.validateJoi(validateObject, schema.sold);

    if (error) {
      return util.errorstatus(res, 400, error);
    }
    return next();
  }

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
      status, min_price, max_price, body_type,
    } = req.query;

    const validateObject = {
      status, min_price, max_price, body_type,
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

  /**
  * @static
  * @description Validates a flag request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateFlag(req, res, next) {
    const { carId } = req.params;
    const { reason, description } = req.body;

    const validateObject = { carId, reason, description };
    const error = util.validateJoi(validateObject, schema.flag);

    if (error) {
      return util.errorstatus(res, 400, error);
    }

    return next();
  }

  static validateImage(req, res, next) {
    // console.log(req.files);
    if (!req.files) return util.errorstatus(res, 404, 'NO IMAGE FOUND');
    return next();
  }
}

export default validate;
