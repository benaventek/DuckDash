import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from "../data/users.js";
import presetTests from "../data/presetTests.js";

const db = await dbConnection();
db.dropDatabase();
await presetTests.CreateTypingTest("Test 1", "This is a test", "Easy");
await presetTests.CreateTypingTest("Test 2", "This is a test", "Easy");

await console.log("Done seeding database");
await closeConnection();
