import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from "../data/users.js";
import presetTests from "../data/presetTests.js";

const db = await dbConnection();

await presetTests.CreateTypingTest("Test 1", "This is a test", "Easy", 30);
await presetTests.CreateTypingTest("Test 2", "This is a test", "Easy", 45);

await console.log("Done seeding database");
await closeConnection();
