const validate = require('../validations/summery');

const validateSummery = (req, res, next) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }
    next()
};

module.exports = validateSummery;