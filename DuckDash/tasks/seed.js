import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from "../data/users.js";

const db = await dbConnection();
await db.dropDatabase();

await users.addUser(
  "test",
  "Dremike6027@getNamedMiddlewareRegex.com",
  "test",
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  "This is a test user"
);
await closeConnection();
