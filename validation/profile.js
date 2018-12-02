const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  //check if required fields are empty before sending it on to test as empty string or not
   data.handle = !isEmpty(data.handle) ? data.handle : '';
   data.status = !isEmpty(data.status) ? data.status : '';
   data.skills = !isEmpty(data.skills) ? data.skills : '';
  
  if (!validator.isLength(data.handle, { min: 2, max: 40})) {
    errors.handle = 'Handle must be between 2 and 40 characters.';
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Handle is required.';
  }
  
  if (validator.isEmpty(data.status)) {
    errors.status = 'Status is required.';
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = 'Skills are required.';
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  
  return {
       errors,
       isValid: isEmpty(errors),
   }
}