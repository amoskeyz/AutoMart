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
    state: Joi.string().valid('new', 'used'),
    body_type: Joi.string().valid('car', 'van', 'truck', 'trailer', 'bus', 'motorbike', 'jeep'),
  }),

  carId: Joi.object().keys({
    carId: Joi.number().required(),
  }),

  flag: Joi.object().keys({
    carId: Joi.number().required(),
    reason: Joi.string().required(),
    description: Joi.string().required().min(30),
  }),
};

export default schema;
