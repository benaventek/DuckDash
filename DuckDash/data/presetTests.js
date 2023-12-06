import { presetTests } from "../config/mongoCollections.js";
import validateFuncs from "../helpers/validation.js";

let ExportedMethods = {
  //timelimit between 30 and 300 seconds
  async CreateTypingTest(testTitle, text, difficulty, timeLimit) {
    if (!testTitle || !text || !difficulty || !timeLimit)
      throw new Error("Invalid user inputs");
    if (typeof testTitle !== "string") throw "Invalid test title";
    if (typeof text !== "string") throw "Invalid text";
    if (typeof difficulty !== "string") throw "Invalid difficulty";
    if (typeof timeLimit !== "number") throw "Invalid time limit";
    testTitle = testTitle.trim();
    text = text.trim();
    difficulty = difficulty.trim();
    validateFuncs.validateTypingTestInput(
      testTitle,
      text,
      difficulty,
      timeLimit
    );
    //Create new user object
    let newTest = {
      testTitle: testTitle,
      text: text,
      difficulty: difficulty,
      timeLimit: timeLimit,
      testScores: [],
    };
    //If there exists a test with the same name throw an error
    const testCollection = await presetTests();
    const duplicateTest = await testCollection.findOne({
      testTitle: testTitle,
    });
    if (duplicateTest) throw "Test with same name already exists";
    const insertInfo = await testCollection.insertOne(newTest);
    if (insertInfo.insertedId === 0) throw "Could not add test";
    return 1;
  },
  async getAllTests() {
    const testCollection = await presetTests();
    const allTests = await testCollection.find({}).toArray();
    return allTests;
  },
  async getTestById(id) {
    if (!id) throw "Invalid test id";
    if (typeof id !== "string") throw "Invalid test id";
    id = id.trim();
    const testCollection = await presetTests();
    const test = await testCollection.findOne({ _id: id });
    if (!test) throw "Test not found";
    return test;
  },
  async getTestsByDifficulty(difficulty) {
    if (!difficulty) throw "Invalid difficulty";
    if (typeof difficulty !== "string") throw "Invalid difficulty";
    difficulty = difficulty.trim();
    const testCollection = await presetTests();
    const tests = await testCollection
      .find({ difficulty: difficulty })
      .toArray();
    if (!tests) throw "Tests not found";
    return tests;
  },
  async getTestByTitle(testTitle) {
    if (!testTitle) throw "Invalid test title";
    if (typeof testTitle !== "string") throw "Invalid test title";
    testTitle = testTitle.trim();
    const testCollection = await presetTests();
    const test = await testCollection.findOne({ testTitle: testTitle });
    if (!test) throw "Test not found";
    return test;
  },
};

export default ExportedMethods;
