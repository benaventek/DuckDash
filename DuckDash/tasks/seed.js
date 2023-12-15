import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from "../data/users.js";
import presetTests from "../data/presetTests.js";
import results from "../data/results.js";
const db = await dbConnection();

/* await users.addUser("dremike1", "test@gmail.com", "Password#1");
await users.addUser("dremike12", "test2@gmail.com", "Password#12");
await users.addUser("dremike13", "test3@gmail.com", "Password#13");
await users.addUser("dremike14", "test4@gmail.com", "Password#14");

await presetTests.CreateTypingTest(
  "Honor Pledge",
  "I pledge my honor that I have abided by the Stevens Honor System.",
  "Easy",
  30
);
await presetTests.CreateTypingTest("Test 2", "This is a test", "Easy", 45);
await presetTests.CreateTypingTest(
  "Test 3",
  "this is another test ;)",
  "Easy",
  45
); */
/* await results.addResult(
  "preset",
  "6574e7b84edd0bd46702797b",
  "6574e9c677a449ce53769656",
  100,
  100,
  "12/16/2020",
  100
); */

console.log(await results.getResultsByUsername("Dremike6027"));

console.log("Done seeding database");
await closeConnection();
