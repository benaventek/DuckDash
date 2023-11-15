import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exportedMethods = {
  //username, email, passwd, profilepicture, userbio, are all given by the user
  //friendsList and testResultsList are initialized as empty arrays
  async addUser(username, email, password, profilePictureUrl, userBio) {
    //ToDo: Validate all user inputs, throw error if invalid

    //Create new user object
    //initialize friendsList and testResultsList as empty arrays
    let friendsList = [];
    let testResultsList = [];
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
