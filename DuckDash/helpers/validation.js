//File used to validate various user inputs

import { isStringObject } from "util/types";
import validator from "validator";

//Function to validate user registration inputs
const validateFuncs = {
  validateRegisterInput(username, email, password) {
    let errors = {};

    //Username checks
    //Username must be alphanumeric
    if (validator.isEmpty(username)) {
      errors.username = "Username field is required";
    }
    if (!validator.isAlphanumeric(username)) {
      errors.username = "Username must contain only letters and numbers";
    }
    //Email checks
    if (validator.isEmpty(email)) {
      errors.email = "Email field is required";
    } else if (!validator.isEmail(email)) {
      errors.email = "Email is invalid";
    }

    //Password checks
    if (validator.isEmpty(password)) {
      errors.password = "Password field is required";
    }
    let passwordOptions = {
      minLength: 8,
      maxLength: 14,
      minNumbers: 1,
      minSymbols: 1,
    };
    if (validator.isStrongPassword(password, passwordOptions) === false) {
      errors.password =
        "Password must be between 8 and 14 characters, and contain at least one number and one special character";
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  },
  validUsername(username) {
    if (validator.isEmpty(username)) {
      throw "No Username Provided";
    }
    if (!validator.isAlphanumeric(username)) {
      throw "Usernames only contain alphanumeric characters";
    }
    return username.trim();
  },
};
export default validateFuncs;
