import { friends } from "../config/mongoCollections.js";
import validateFuncs from "../helpers/validation.js";

let exportedMethods = {
  async addFriend(user1, user2) {
    //ToDo: Validate all inputs, throw error if invalid
    user1 = validateFuncs.validUsername(user1);
    user2 = validateFuncs.validUsername(user2);
    let newFriend = {
      users: { user1, user2 },
    };
    let testFriend = {
      users: { user2, user1 },
    };
    //Add new result to database
    const requestCollection = await friends();
    if (
      requestCollection.includes(newFriend) ||
      requestCollection.includes(testFriend)
    )
      throw new Error("Already added friend");
    const insertInfo = await requestCollection.insertOne(newFriend);
    if (insertInfo.insertedId === 0) throw "Could not add result";
    return 1;
  },
  async getFriends(user) {
    //ToDo: Implement
  },
  async delFriend(id) {
    //TODO: Implement & add validation.
    const userCollection = await results();

    return userCollection;
  },
};
export default exportedMethods;
