import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),

  password: Joi.string().min(6).required(),
});
