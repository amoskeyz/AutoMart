import Joi from 'joi';

const schema = {
  signup: Joi.object().keys({
    first_name: Joi.string().regex(/^[A-Za-z]{3,}$/).trim()
      .required(),
    last_name: Joi.string().regex(/^[A-Za-z]{3,}$/).trim()
      .required(),
    email: Joi.string().email().required()
      .trim(),
    password: Joi.string().required().min(8),
    address: Joi.string().required(),
  }),

  signin: Joi.object().keys({
    email: Joi.string().email().required()
      .trim(),
    password: Joi.string().required().min(8),
  }),

  user: Joi.object().keys({
    email: Joi.string().email().required()
      .trim(),
  }),

  car: Joi.object().keys({
    manufacturer: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    body_type: Joi.string().trim().required().valid('car', 'van', 'truck', 'trailer', 'bus', 'motorbike', 'jeep')
      .trim(),
    price: Joi.number().required(),
    state: Joi.string().trim().valid('new', 'used').required(),
  }),

  order: Joi.object().keys({
    amount: Joi.number().required(),
    car_id: Joi.number().required(),
  }),

  updateOrder: Joi.object().keys({
    price: Joi.number().required(),
  }),

  updateCar: Joi.object().keys({
    price: Joi.number().required(),
  }),

  getCar: Joi.object().keys({
    status: Joi.string().lowercase().valid('available'),
    min_price: Joi.number(),
    max_price: Joi.number(),
    body_type: Joi.string().lowercase().valid('car', 'van', 'truck', 'trailer', 'bus', 'motorbike', 'jeep'),
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
