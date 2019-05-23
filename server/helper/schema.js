import Joi from 'joi';

const schema = {
  signup: Joi.object().keys({
    firstName: Joi.string().regex(/^[A-Za-z]{3,}$/)
      .required(),
    lastName: Joi.string().regex(/^[A-Za-z]{3,}$/)
      .required(),
    email: Joi.string().email().required()
      .trim(),
    password: Joi.string().required().min(8),
  }),
};

export default schema;
