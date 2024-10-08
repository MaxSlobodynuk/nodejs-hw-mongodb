import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().min(3).max(25).required().messages({
    'string.base': 'email should be a string',
    'string.min': 'email should have at least {#limit} characters',
    'string.max': 'email should have at most {#limit} characters',
    'any.required': 'email is required',
  }),
  password: Joi.string().required(),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().min(3).max(25).required().messages({
    'string.base': 'email should be a string',
    'string.min': 'email should have at least {#limit} characters',
    'string.max': 'email should have at most {#limit} characters',
    'any.required': 'email is required',
  }),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
