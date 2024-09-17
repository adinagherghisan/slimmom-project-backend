const Joi = require('joi');

const objectId = Joi.string().length(24).hex().message('Invalid ObjectId format');

const summarySchema = Joi.object({
    userId: objectId.required(),
    summaryInfo: Joi.array().items(Joi.object({
        diaryId: objectId.required(),
        daily_left: Joi.number().min(0).required().messages({
            'number.base': '{{#label}} must be a number',
            'number.min': '{{#label}} must be at least 0',
            'any.required': '{{#label}} is required'
        }),
        daily_consumed: Joi.number().min(0).required().messages({
            'number.base': '{{#label}} must be a number',
            'number.min': '{{#label}} must be at least 0',
            'any.required': '{{#label}} is required'
        }),
        daily_rate: Joi.number().min(0).default(2800).messages({
            'number.base': '{{#label}} must be a number',
            'number.min': '{{#label}} must be at least 0'
        }),
        percentage: Joi.number().min(0).max(100).required().messages({
            'number.base': '{{#label}} must be a number',
            'number.min': '{{#label}} must be at least 0',
            'number.max': '{{#label}} cannot exceed 100%',
            'any.required': '{{#label}} is required'
        })
    })).required().messages({
        'array.base': '{{#label}} must be an array of objects',
        'any.required': '{{#label}} is required'
    })
});

const validate = (summery) => {
    return summarySchema.validate(summery, { abortEarly: false });
};

module.exports = validate;
