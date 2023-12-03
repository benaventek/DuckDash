//File used to validate various user inputs

import validator from "validator";
import { ObjectId } from "mongodb";
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
  //Function to validate user update inputs
  validUpdateInfo(updateSelection, updateValue) {
    updateValue = updateValue.trim();
    //bio will have max length of 250 characters
    if (updateSelection === "Bio") {
      if (typeof updateValue !== "string") {
        throw "Bio must be a string";
      }
      if (updateValue.length > 250) {
        throw "Bio must be less than 250 characters";
      }
      if (validator.isEmpty(updateValue)) {
        throw "No Bio Provided";
      }
    } else if (updateSelection === "ProfilePictureUrl") {
      //TODO add way to legitimately check if the file exists or not or if its a valid url
      if (typeof updateValue !== "string") {
        throw "Invalid Profile Picture Url";
      }
      if (validator.isEmpty(updateValue)) {
        throw "No Profile Picture Provided";
      }
    } else if (updateSelection === "FriendsList") {
      if (this.validUsername(updateValue) === false) {
        throw "Invalid Friend Username";
      }
    } else if (updateSelection === "TestResultsList") {
      if (!ObjectId.isValid(updateValue)) {
        throw "Invalid Test Result Id";
      }
    }
    return updateValue;
  },
};
export default validateFuncs;
