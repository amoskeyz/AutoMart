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
};

export default schema;
