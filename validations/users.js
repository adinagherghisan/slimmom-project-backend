const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
    email: Joi.string().email().required().messages({
        'string.email': `{{#label}} must be followed by a '.' domain suffix. For example, adrian@gmail.com`,
        'any.required': `{{#label}} is required`,
    }),
    password: Joi.string().min(6).max(60).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': `{{#label}} must be followed by a '.' domain suffix. For example, adrian@gmail.com`,
        'any.required': `{{#label}} is required`,
    }),
    password: Joi.string().min(6).max(60).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
});


const validateRegistration = (user) => {
    return registerSchema.validate(user, { abortEarly: false }); 
};

const validateLogin = (user) => {
    return loginSchema.validate(user, { abortEarly: false }); 
};

module.exports = { validateRegistration, validateLogin };
