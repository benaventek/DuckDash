import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users.js';
import presetTests from '../data/presetTests.js';
import results from '../data/results.js';
const db = await dbConnection();

// await users.addUser('dremike1', 'test@gmail.com', 'Password#1');
// await users.addUser('dremike12', 'test2@gmail.com', 'Password#12');
// await users.addUser('dremike13', 'test3@gmail.com', 'Password#13');
// await users.addUser('dremike14', 'test4@gmail.com', 'Password#14');

await presetTests.CreateTypingTest(
  'Honor Pledge',
  'I pledge my honor that I have abided by the Stevens Honor System.',
  'Easy',
  15
);
await presetTests.CreateTypingTest(
  'Twinkle Twinkle Little Star',
  `Twinkle, twinkle, little star, how I wonder what you are. Up above the world so high,
like a diamond in the sky. Twinkle, twinkle, little star, how I wonder what you are.
  When the blazing sun is set, and the grass with dew is wet. Then you show your little
  light, twinkle, twinkle all the night. Twinkle, twinkle little star, how I wonder what you
  are. Then the traveler in the dark thanks you for your tiny spark. How could he see where to
  go if you did not twinkle so? Twinkle, twinkle little star, how I wonder what you are.
  As your bright and tiny spark lights the traveler in the dark, though I know not what you
  are, twinkle, twinkle, little star. Twinkle, twinkle, little star, how I wonder what you are.`,
  'Easy',
  60
);
await presetTests.CreateTypingTest(
  'Alphabet',
  'a b c d e f g h i j k l m n o p q r s t u v w x y z',
  'Easy',
  15
);
await presetTests.CreateTypingTest(
  'Gold Digger',
  `She take my money well I'm in need Yeah she's a triflin friend indeed Oh she's a gold digga way over town That dig's on me (She take my money) Now I aint sayin she a gold digger (when I'm need) But she aint messin wit no broke, broke (She take my money) Now I aint sayin she a gold digger (when I'm need) But she aint messin wit no broke, broke`,
  'Easy',
  15
);
// await results.addResult(
//   'preset',
//   '6574e7b84edd0bd46702797b',
//   '6574e9c677a449ce53769656',
//   100,
//   100,
//   '12/16/2020',
//   100
// );

// console.log(await results.getResultsBydisplayname('Dremike6027'));

console.log('Done seeding database');
await closeConnection();
