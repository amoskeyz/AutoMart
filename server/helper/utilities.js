import Joi from 'joi';

class Utilities {
  /**
  * @static
  * @description Validates an Object against the schema
  * @param {Object} validateObject - object to be validated
  * @param {Object} schemaData - Joi schema
  * @memberof Utilities
  */

  static validateJoi(validateObject, schemaData) {
    let error;
    Joi.validate(validateObject, schemaData, { abortEarly: false }, (err) => {
      if (err) {
        error = err.details;
        error = error.map((singleErrors) => {
          let { message } = singleErrors;
          message = message.replace(/"/gi, '');
          if (message.includes('[A-Za-z]')) {
            message = `${singleErrors.path[0]} should be a string with at least 3 characters`;
          }
          return message;
        });
      }
    });
    return error;
  }

  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {string} errorMessage - the appropraite error message
  * @memberof Utilities
  */

  static errorstatus(res, statusCode, errorMessage) {
    return res.status(statusCode).json({
      status: statusCode,
      error: errorMessage,
    });
  }

  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {string} errorMessage - the appropraite error message
  * @memberof Utilities
  */

  static successStatus(res, status, key, object) {
    const response = { status };
    response[key] = object;

    return res.status(status).json(response);
  }
}

export default Utilities;
