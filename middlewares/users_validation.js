const { validateRegistration, validateLogin } = require('../validations/users');

const validateSingIn = (req, res, next) => {
    const { error } = validateRegistration(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    next();
};

const validateLogIn = (req, res, next) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    next()
};

module.exports = { validateLogIn, validateSingIn };
