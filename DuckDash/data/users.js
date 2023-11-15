import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validateFuncs from "../helpers/validation.js";

let exportedMethods = {
  //username, email, passwd, are all given by the user
  //ProfilePicture, BIO, friendsList and testResultsList are initialized to defaults
  async addUser(username, email, password) {
    //ToDo: Validate all user inputs, throw error if invalid
    let errorCheck = validateFuncs.validateRegisterInput(
      username,
      email,
      password
    );
    if (errorCheck.isValid === false)
      throw new Error(
        "Invalid user inputs" + JSON.stringify(errorCheck.errors)
      );
    //Create new user object
    //initialize friendsList and testResultsList as empty arrays
    let friendsList = [];
    let testResultsList = [];
    let userBio = ""; //initialize userBio to empty string
    let profilePictureUrl = "../public/LocalImages/defaultProfilePicture.png"; //initialize profilePictureUrl to default Profile Picture
    //ToDo: hash password

    let newUser = {
      username: username,
      email: email,
      password: password,
      profilePictureUrl: profilePictureUrl,
      userBio: userBio,
      friendsList: friendsList,
      testResultsList: testResultsList,
    };
    //Add new user to database
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedId === 0) throw "Could not add user";
    return 1;
  },
};
export default exportedMethods;
