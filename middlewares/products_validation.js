const validate = require('../validations/products');

const validateProduct = (req, res, next) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }
    
    next();
};

module.exports = validateProduct;