//File used to validate various user inputs

import { isStringObject } from "util/types";
import validator from "validator";

//Function to validate user registration inputs
export default function validateRegisterInput(username, email, password) {
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

  //Profile Picture checks
  if (validator.isEmpty(profilePictureUrl)) {
    errors.profilePictureUrl = "Profile Picture field is required";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
