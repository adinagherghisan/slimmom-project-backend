const Joi = require('joi');

const productSchema = Joi.object({
  categories: Joi.string().required().messages({
        'any.required': `{{#label}} is required`
    }),
  weight: Joi.number().required().messages({
        'any.required': `{{#label}} is required`
    }),
  title: Joi.string().required().messages({
        'any.required': `{{#label}} is required`
    }),
  calories: Joi.number().required().messages({
        'any.required': `{{#label}} is required`
    }),
  groupBloodNotAllowed: Joi.array().items(Joi.boolean()).required().messages({
        'any.required': `{{#label}} is required`
    }),
});

const validate = (items) => {
    return productSchema.validate(items, { abortEarly: false }); 
};

module.exports = validate;