import { results } from "../config/mongoCollections.js";
import validateFuncs from "../helpers/validation.js";
import users from "./users.js";
import { ObjectId } from "mongodb";
import tests from "./presetTests.js";

let exportedMethods = {
  async addResult(testType, testID, userID, wpm, accuracy) {
    //check that given ID are valid objectIDs
    if (!testType || !userID || !wpm || !accuracy)
      throw new Error("Invalid inputs");
    //check that sender and receiver exist
    if (testType !== "random") {
      if (!testID) throw new Error("Invalid inputs");
    } else {
      testID = null;
    }
    if (!ObjectId.isValid(userID)) throw new Error("Invalid inputs");
    if (!ObjectId.isValid(testID)) throw new Error("Invalid inputs");
    try {
      let user = await users.getUserById(userID);
      let test = await tests.getTestById(testID);
    } catch (error) {
      throw new Error("User or test does not exist");
    }
    let DateTaken = new Date().toLocaleDateString();
    let timeTaken = new Date().toLocaleTimeString();
    //create new request object
    let newResult = {
      testType: testType,
      testID: testID,
      userID: userID,
      wpm: wpm,
      accuracy: accuracy,
      DateTaken: DateTaken,
      timeTaken: timeTaken,
    };
    //Add new user to database
    const resultCollection = await results();
    const insertInfo = await resultCollection.insertOne(newResult);
    if (insertInfo.insertedId === 0) throw "Could not add user";
    return 1;
  },

  async getResults() {
    const userCollection = await results();
    return userCollection;
  },
  async getResultsBydisplayname(displayname) {
    if (!displayname) throw new Error("Invalid inputs");
    displayname = validateFuncs.validdisplayname(displayname);
    try {
      let user = await users.getUserBydisplayname(displayname);
    } catch (error) {
      throw new Error("User does not exist");
    }
    let user = await users.getUserBydisplayname(displayname);
    const resultCollection = await results();
    const result = await resultCollection
      .find({
        userID: user.userID.toString(),
      })
      .toArray();
    console.log(user.userID.toString());
    if (!result) return false;
    return result;
  },
};
export default exportedMethods;
