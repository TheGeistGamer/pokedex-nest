import * as Joi from 'joi';

export const JoiValidatorSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3000),
})