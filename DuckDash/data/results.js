import { results } from "../config/mongoCollections.js";
import validateFuncs from "../helpers/validation.js";

let exportedMethods = {
  async addResult(user, wpm, accuracy) {
    //ToDo: Validate all inputs, throw error if invalid
    user = validateFuncs.validUsername(user);
    
    let newResult = {
        score: wpm * accuracy,
        user: user,
        wpm: wpm,
        accuracy: accuracy,
    };
    //Add new result to database
    const resultCollection = await results();
    const insertInfo = await userCollection.insertOne(newResult);
    if (insertInfo.insertedId === 0) throw "Could not add result";
    return 1;
  },

  async getResults(){
    const userCollection = await results();
    return userCollection;
  },
  async getResultByUsername(username) {
    username = validateFuncs.validUsername(username);
    const userCollection = await results();
    const user = await userCollection.find({ user: username });
    if (!user) return false;
    return user;
  },
  
};
export default exportedMethods;
