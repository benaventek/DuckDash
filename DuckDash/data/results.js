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
    if (testType !== "Random") {
      if (!testID) throw new Error("Invalid inputs");
      if (!ObjectId.isValid(testID)) throw new Error("Invalid inputs");
    } else {
      testID = null;
    }
    if (!ObjectId.isValid(userID)) throw new Error("Invalid inputs");
    try {
      let user = await users.getUserById(userID);
      if (testID !== null) {
        let test = await tests.getTestById(testID);
      }
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
    if (insertInfo.insertedId === 0) throw "Could not add result";
    return insertInfo.insertedId;
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
  async getResultByID(id) {
    const resultCollection = await results();
    const result = await resultCollection.findOne({
      _id: new ObjectId(id),
    });

    return result;
  },
  async calcAvgWPM(users){
    let usersWithAverageWPM = [];

    for(let user of users){
      let totalWPM = 0;
      let testCount = 0;
      for(let testID of user.testResultsList){
        let testResult = await this.getResultByID(testID);

        totalWPM += testResult.wpm;
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
  
};
export default exportedMethods;
