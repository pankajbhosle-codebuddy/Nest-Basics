import Joi from 'joi';

export const createGenreSchema = Joi.object({
  name: Joi.string().trim().required(),
});
