const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    if (!validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.NAME = 'Name must be between two and thirty characters';
    }
    return {
        errors,
        isValid: isEmpty(errors),
    }
}