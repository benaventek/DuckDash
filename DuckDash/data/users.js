import { users } from "../config/mongoCollections.js";
import validateFuncs from "../helpers/validation.js";
import bcrypt from "bcryptjs";
import * as validator from "email-validator";
import { ObjectId } from "mongodb";
import results from './results.js';
const saltRounds = 16;

let exportedMethods = {
  //displayname, email, passwd, are all given by the user
  //ProfilePicture, BIO, friendsList and testResultsList are initialized to defaults
  //displayname must not be taken
  async addUser(displayname, email, password) {
    //ToDo: Validate all user inputs, throw error if invalid
    if (!displayname || !email || !password)
      throw new Error("Invalid user inputs");
    displayname = displayname.trim();
    email = email.trim();
    password = password.trim(); //trim all inputs
    email = email.toLowerCase(); //convert email to lowercase
    let errorCheck = validateFuncs.validateRegisterInput(
      displayname,
      email,
      password
    );
    if (errorCheck.isValid === false)
      throw new Error(
        "Invalid user inputs" + JSON.stringify(errorCheck.errors)
      );
    //Check if email and or displayname is already taken, throw error if taken (displayname is case sensitive)
    try {
      const userCollection = await users();
      const checkdupUser = await userCollection.findOne({
        displayname: displayname,
      });
      const checkDupEmail = await userCollection.findOne({ email: email });
      console.log(checkDupEmail, checkdupUser);
      if (checkDupEmail || checkdupUser)
        throw new Error("Email or displayname already taken");
    } catch (error) {
      throw error;
    }
    //Create new user object
    //initialize friendsList and testResultsList as empty arrays
    let friendsList = [];
    let testResultsList = [];
    let userBio = ""; //initialize userBio to empty string
    let profilePictureUrl = "../public/LocalImages/defaultProfilePicture.png"; //initialize profilePictureUrl to default Profile Picture
    //Hash using bcrypt
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
      displayname: displayname,
      email: email,
      password: hashedPassword,
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
  async getUserBydisplayname(displayname) {
    displayname = validateFuncs.validdisplayname(displayname);
    const userCollection = await users();
    const user = await userCollection.findOne({
      displayname: displayname,
    });
    if (!user) throw "User Doesnt Exist";
    const returnInfo = {
      userID: user._id,
      email: user.email,
      displayname: user.displayname,
      profilePictureUrl: user.profilePictureUrl,
      userBio: user.userBio,
      friendsList: user.friendsList,
      testResultsList: user.testResultsList,
    };
    return returnInfo;
  },
  //takes in displayname, and then a selection of what to update, only selections that are valid are "Bio", "ProfilePictureUrl", "FriendsList", "TestResultsList", and also an updateValue
  async updateUser(displayname, updateSelection, updateValue) {
    if (!displayname || !updateSelection || !updateValue)
      throw new Error("Invalid user inputs");
    if (
      typeof displayname !== "string" ||
      typeof updateSelection !== "string" ||
      typeof updateValue !== "string"
    )
      throw new Error("Invalid user inputs");
    updateValue = validateFuncs.validUpdateInfo(updateSelection, updateValue);
    displayname = validateFuncs.validdisplayname(displayname);
    if (updateSelection === "Bio") {
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { displayname: displayname },
        { $set: { userBio: updateValue } }
      );
      if (!updateInfo) throw new Error("Could not update user");
      return 1;
    } else if (updateSelection === "ProfilePictureUrl") {
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { displayname: displayname },
        { $set: { profilePictureUrl: updateValue } }
      );
      if (!updateInfo) throw new Error("Could not update user");
      return 1;
      //for friendsList the update value is the friends displayname that will be appended, we will get the ID throgh the getUserBydisplayname function
    } else if (updateSelection === "FriendsList") {
      let friend = await this.getUserBydisplayname(updateValue);
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { displayname: displayname },
        {
          $push: {
            friendsList: friend.userID,
          },
        }
      );
      if (!updateInfo) throw new Error("Could not update user");
      return 1;
      //for TestResultsList the update value is the test ID that will be appended.
    } else if (updateSelection === "TestResultsList") {
      const userCollection = await users();
      const updateInfo = await userCollection.updateOne(
        { displayname: displayname },
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
  async loginUser(email, password) {
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid user inputs");
    }
    //trim all inputs
    email = email.trim();
    password = password.trim();
    validator.validate(email);
    email = email.toLowerCase();

    let errorCheck = validateFuncs.validateRegisterInput(
      "NodisplaynameNeeded",
      email,
      password
    );
    if (errorCheck.isValid === false)
      throw new Error(
        "Invalid user inputs" + JSON.stringify(errorCheck.errors)
      );
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email });
    if (!user) {
      throw new Error("Either the email address or password is invalid");
    }
    const hashedPassword = user.password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new Error("Either the email address or password is invalid");
    }
    const returnInfo = {
      userID: user._id,
      email: user.email,
      displayname: user.displayname,
      profilePictureUrl: user.profilePictureUrl,
      userBio: user.userBio,
      friendsList: user.friendsList,
      testResultsList: user.testResultsList,
    };
    return returnInfo;
  },
  async registerUser(displayname, email, password) {
    if (!email || !password || !displayname) {
      throw new Error("All fields are required");
    }
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof displayname !== "string"
    ) {
      throw new Error("Invalid user inputs");
    }
    //trim all inputs
    email = email.trim();
    password = password.trim();
    displayname = displayname.trim();
    validator.validate(email);
    email = email.toLowerCase();
    try {
      await this.addUser(displayname, email, password);
      return true;
    } catch (error) {
      throw error;
    }
  },
  async getUserById(id) {
    if (!id) throw "Invalid user id";
    if (typeof id !== "string") throw "Invalid user id";
    id = id.trim();
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) throw "User not found";
    const returnInfo = {
      userID: user._id,
      email: user.email,
      displayname: user.displayname,
      profilePictureUrl: user.profilePictureUrl,
      userBio: user.userBio,
      friendsList: user.friendsList,
      testResultsList: user.testResultsList,
    };
    return returnInfo;
  },
  async getUsersByAverageWPM(){
    const userCollection = await users();
    const allUsers = await userCollection.find({}).toArray();
    if(!allUsers) throw 'Error while retrieving Users';
    
    let usersWithAverageWPM = [];

    for(let user of allUsers){
      let totalWPM = 0;
      let testCount = 0;
      for(let testID of user.testResultsList){
        let testResult = await results.getResultByID(testID);

        totalWPM += parseFloat(testResult.wpm);
        testCount++;
      }
      let averageWPM = testCount > 0 ? totalWPM / testCount : 0;

      let userWithAverageWPM = {
        userID: user.userID,
        email: user.email,
        displayname: user.displayname,
        profilePictureUrl: user.profilePictureUrl,
        userBio: user.userBio,
        friendsList: user.friendsList,
        testResultsList: user.testResultsList,
        averageWPM: averageWPM
      };
      usersWithAverageWPM.push(userWithAverageWPM);


    }
    usersWithAverageWPM.sort((a,b) => b.averageWPM - a.averageWPM);
    return usersWithAverageWPM;
  },
  async getUsersByAverageAccuracy(){
    const userCollection = await users();
    const allUsers = await userCollection.find({}).toArray();
    if(!allUsers) throw 'Error while retrieving Users';
    
    let usersWithAverageAccuracy = [];

    for(let user of allUsers){
      let totalAcc = 0;
      let testCount = 0;
      for(let testID of user.testResultsList){
        let testResult = await results.getResultByID(testID);

        totalAcc += parseFloat(testResult.accuracy);
        testCount++;
      }
      let averageAcc = testCount > 0 ? totalAcc / testCount : 0;

      let userWithAverageWPM = {
        userID: user.userID,
        email: user.email,
        displayname: user.displayname,
        profilePictureUrl: user.profilePictureUrl,
        userBio: user.userBio,
        friendsList: user.friendsList,
        testResultsList: user.testResultsList,
        averageAcc: averageAcc
      };
      usersWithAverageAccuracy.push(userWithAverageWPM);


    }
    usersWithAverageAccuracy.sort((a,b) => b.averageAcc - a.averageAcc);
    return usersWithAverageAccuracy;
  },
};
export default exportedMethods;
