import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users.js';
import presetTests from '../data/presetTests.js';

const db = await dbConnection();

await presetTests.CreateTypingTest(
  'Honor Pledge',
  'I pledge my honor that I have abided by the Stevens Honor System.',
  'Easy',
  30
);
await presetTests.CreateTypingTest('Test 2', 'This is a test', 'Easy', 45);
await presetTests.CreateTypingTest(
  'Test 3',
  'this is another test ;)',
  'Easy',
  45
);

console.log('Done seeding database');
await closeConnection();
