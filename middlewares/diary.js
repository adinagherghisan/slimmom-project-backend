const validate = require('../validations/diary');

const validateDiary = (req, res, next) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }
    next()
};

module.exports = validateDiary;