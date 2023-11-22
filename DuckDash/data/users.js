import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validateFuncs from "../helpers/validation.js";

let exportedMethods = {
  //username, email, passwd, are all given by the user
  //ProfilePicture, BIO, friendsList and testResultsList are initialized to defaults
  //username must not be taken
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
    //Check if username is taken
    if (await this.getUserByUsername(username))
      throw new Error("Username is already taken");
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
  async getUserByUsername(username) {
    username = validateFuncs.validUsername(username);
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) return false;
    return user;
  },
  //takes in username, and then a selection of what to update, only selections that are valid are "Bio", "ProfilePictureUrl", "FriendsList", "TestResultsList", and also an updateValue
  async updateUser(username, updateSelection, updateValue) {
    updateValue = validateFuncs.validUpdateInfo(updateSelection, updateValue);
    username = validateFuncs.validUsername(username);
    if (updateSelection === "Bio") {
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { username: username },
        { $set: { userBio: updateValue } }
      );
      if (!updateInfo) throw new Error("Could not update user");
      return 1;
    } else if (updateSelection === "ProfilePictureUrl") {
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { username: username },
        { $set: { profilePictureUrl: updateValue } }
      );
      if (!updateInfo) throw new Error("Could not update user");
      return 1;
      //for friendsList the update value is the friends username that will be appended, we will get the ID throgh the getUserByUsername function
    } else if (updateSelection === "FriendsList") {
      let friend = await this.getUserByUsername(updateValue);
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { username: username },
        {
          $push: {
            friendsList: friend._id,
          },
        }
      );
      if (!updateInfo) throw new Error("Could not update user");
      return 1;
      //for TestResultsList the update value is the test ID that will be appended.
    } else if (updateSelection === "TestResultsList") {
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { username: username },
        {
          $push: {
            testResultsList: updateValue,
          },
        }
      );
      if (!updateInfo) throw new Error("Could not update user");
      return 1;
    } else {
      throw new Error("Invalid update selection");
    }
  },
};
export default exportedMethods;
