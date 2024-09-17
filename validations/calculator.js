const Joi = require('joi');

const objectId = Joi.string().length(24).hex().messages({
    'string.length': '{{#label}} must be a valid ObjectId (24 characters long)',
    'string.hex': '{{#label}} must only contain hexadecimal characters'
});

const calculatorSchema = Joi.object({
    userId: objectId.optional(),
    data: Joi.array().items(Joi.object({
        productId: objectId,
        height: Joi.number().integer().min(100).max(300).required().messages({
            'number.min': `{{#label}} should be at least {#limit} cm`,
            'number.max': `{{#label}} should be at most {#limit} cm`,
            'any.required': `{{#label}} is required`
        }),
        age: Joi.number().integer().min(18).max(120).required().messages({
            'number.min': `{{#label}} should be at least {#limit} years`,
            'number.max': `{{#label}} should be at most {#limit} years`,
            'any.required': `{{#label}} is required`
        }),
        current_weight: Joi.number().integer().min(30).max(500).required().messages({
            'number.min': `{{#label}} should be at least {#limit} kg`,
            'number.max': `{{#label}} should be at most {#limit} kg`,
            'any.required': `{{#label}} is required`
        }),
        desired_weight: Joi.number().integer().min(30).max(500).required().messages({
            'number.min': `{{#label}} should be at least {#limit} kg`,
            'number.max': `{{#label}} should be at most {#limit} kg`,
            'any.required': `{{#label}} is required`
        }),
        blood_type: Joi.string().valid('0(I)', 'A(II)', 'B(III)', 'AB(IV)').required().messages({
            'any.only': `{{#label}} must be one of the following: '0(I)', 'A(II)', 'B(III)', 'AB(IV)'`,
            'any.required': `{{#label}} is required`
        })
    }))
});

const validate = (calc) => {
    return calculatorSchema.validate(calc, { abortEarly: false });
};

module.exports = validate;
