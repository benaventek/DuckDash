import { requests } from "../config/mongoCollections.js";
import validateFuncs from "../helpers/validation.js";

let exportedMethods = {
  async addRequest(user1, user2) {
    //ToDo: Validate all inputs, throw error if invalid
    user1 = validateFuncs.validUsername(user1);
    user2 = validateFuncs.validUsername(user2);
    let newRequest = {
        from: user1,
        to: user2
    };
    let testRequest = {
        from: user1,
        to: user2
    };
    //Add new result to database
    const requestCollection = await requests();
    if (requestCollection.includes(newRequest) || requestCollection.includes(testRequest)) throw new Error("Request already exists.")
    const insertInfo = await requestCollection.insertOne(newRequest);
    if (insertInfo.insertedId === 0) throw "Could not add result";
    return 1;
  },
  async getRequests(user){

  },

  async delRequest(id){
    //TODO: Implement & add validation.
    const userCollection = await results();
    
    return userCollection;
  },
  
};
export default exportedMethods;
