import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from "../data/users.js";

const db = await dbConnection();

db.dropDatabase();

await users.addUser(
  "test",
  "Dremike6027@getNamedMiddlewareRegex.com",
  "ThisisValid1?",
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  "This is a test user"
);
await users.addUser(
  "test2",
  "Dremike6027@getNamedMiddlewareRegex.com",
  "ThisisValid1?",
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  "This is a test user"
);
await users.updateUser("test", "Bio", "Hello I am a test user");
await users.updateUser(
  "test",
  "ProfilePictureUrl",
  "DuckDash/public/LocalImages/defaultProfilePicture.png"
);
await users.updateUser(
  "test",
  "ProfilePictureUrl",
  "DuckDash/public/LocalImages/defaultProfilePicture.png"
);
await users.updateUser(
  "test",
  "ProfilePictureUrl",
  "DuckDash/public/LocalImages/defaultProfilePicture.png"
);

await users.updateUser("test", "FriendsList", "test2");
await closeConnection();
