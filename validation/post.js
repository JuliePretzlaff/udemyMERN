const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    //check if is empty before sending it on to test as empty string or not
    data.text = !isEmpty(data.text) ? data.text : '';

    if(!validator.isLength(data.text, { min: 10, max: 300})) {
      errors.text = 'Post must be between 10 & 300 characters';
    }

    if(validator.isEmpty(data.text)){
        errors.text = 'Text field is required.';
    }


    return {
        errors,
        isValid: isEmpty(errors),
    }
}