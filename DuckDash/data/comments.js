import { ObjectId } from "mongodb";
import { comments } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
let ExportedMethods = {
  async addComment(AuthorID, commentText, profileId) {
    if (!AuthorID || !commentText || !profileId)
      throw new Error("Invalid user inputs");
    const userCollection = await users();
    let author = await userCollection.findOne({ _id: new ObjectId(AuthorID) });
    let comment = {
      AuthorID: AuthorID,
      AuthorDisplayName: author.displayname,
      commentText: commentText,
      profileId: profileId,
    };
    const commentCollection = await comments();
    const insertInfo = await commentCollection.insertOne(comment);
    if (!insertInfo.insertedId) throw "Could not add comment";
    return comment;
  },
  async getCommentByprofileId(Profileid) {
    if (!Profileid) throw new Error("Invalid user inputs");
    const commentCollection = await comments();
    const comment = await commentCollection
      .find({ profileId: Profileid })
      .toArray();
    if (!comment) return -1;
    return comment;
  },
  async deleteCommentsById(commentid) {
    const commentCollection = await comments();
    const deletionInfo = await commentCollection.deleteOne({
      _id: new ObjectId(commentid),
    });
  },
};
export default ExportedMethods;
