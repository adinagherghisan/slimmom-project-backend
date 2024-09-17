const Joi = require('joi');

const objectId = Joi.string().length(24).hex().messages({
    'string.length': '{{#label}} must be a valid ObjectId (24 characters long)',
    'string.hex': '{{#label}} must only contain hexadecimal characters'
});

const diarySchema = Joi.object({
    userId: objectId.required(),
    productId: objectId.required(),
    date: Joi.date().required().messages({
        'date.base': '{{#label}} must be a valid date',
        'any.required': '{{#label}} is required'
    }),
    product_weight: Joi.number().min(0).required().messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be at least 0',
        'any.required': '{{#label}} is required'
    }),
    product_Calories: Joi.number().min(0).required().messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be at least 0',
        'any.required': '{{#label}} is required'
    })
});

const validate = (diary) => {
    return diarySchema.validate(diary, { abortEarly: false });
};

module.exports = validate;

