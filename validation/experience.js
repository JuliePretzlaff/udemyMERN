const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    //check if is empty before sending it on to test as empty string or not
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if(validator.isEmpty(data.title)){
        errors.title = 'Title field is required.';
    }

    if(validator.isEmpty(data.company)){
      errors.company = 'Company field is required.';
    }

    if(validator.isEmpty(data.from)){
      errors.from = 'From field is required.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}