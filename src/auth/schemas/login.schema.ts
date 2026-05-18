import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),

  password: Joi.string().min(6).max(100).required(),
});
