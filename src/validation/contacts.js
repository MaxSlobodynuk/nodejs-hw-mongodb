import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'phoneNumber should be a string',
    'string.min': 'phoneNumber should have at least {#limit} characters',
    'string.max': 'phoneNumber should have at most {#limit} characters',
    'any.required': 'phoneNumber is required',
  }),
  email: Joi.string().min(3).max(20).required().messages({
    'string.base': 'email should be a string',
    'string.min': 'email should have at least {#limit} characters',
    'string.max': 'email should have at most {#limit} characters',
    'any.required': 'email is required',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'phoneNumber should be a string',
    'string.min': 'phoneNumber should have at least {#limit} characters',
    'string.max': 'phoneNumber should have at most {#limit} characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'email should be a string',
    'string.min': 'email should have at least {#limit} characters',
    'string.max': 'email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});