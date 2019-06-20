import Joi from 'joi';

const schema = {
  signup: Joi.object().keys({
    firstName: Joi.string().regex(/^[A-Za-z]{3,}$/).trim()
      .required(),
    lastName: Joi.string().regex(/^[A-Za-z]{3,}$/).trim()
      .required(),
    email: Joi.string().email().required()
      .trim(),
    password: Joi.string().required().min(8),
    phoneNumber: Joi.number().required(),
  }),

  signin: Joi.object().keys({
    email: Joi.string().email().required()
      .trim(),
    password: Joi.string().required().min(8),
  }),
  car: Joi.object().keys({
    manufacturer: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    bodyType: Joi.string().trim().required()
      .trim(),
    price: Joi.number().required(),
    state: Joi.string().trim().valid('new', 'used').required(),
  }),

  order: Joi.object().keys({
    priceOffered: Joi.number().required(),
  }),

  updateOrder: Joi.object().keys({
    newPriceOffered: Joi.number().required(),
  }),

  updateCar: Joi.object().keys({
    price: Joi.number().required(),
  }),

  getCar: Joi.object().keys({
    status: Joi.string().valid('available'),
    min_price: Joi.number(),
    max_price: Joi.number(),
  }),

  carId: Joi.object().keys({
    carId: Joi.number().required(),
  }),
};

export default schema;
