
# DuckDash - CS546 Final Project

By: Kevin Benavente, Andres Fernandez, Jack Jimenez, Andrew McCauley

## What is DuckDash?
DuckDash is a typing website where the user can take different kinds of typing speed tests compare their scores with other users on the platform. Users can become friends with other users and leave comments on their profile as well check out the leaderboard and see how they rank amongst others.

**Setup**

For profile pictures to work, our website uses an Amazon AWS S3 bucket to host the files. The access key and secret access key are stored in an ENV file which is in the Root of the project folder. It is imporant to never allow this file to be publicly available, as this will lead to Amazon taking certain privelages away from the user, restricting access to the bucket and leading to errors.

You can install the required packages by running:

        npm i
    
**Seeding**

You can seed the database with some dummy login info and some preset tests by running:

        npm run seed


**Running**

You start up the site by running:

        npm start


**Test Accounts**

          Display Name = Email Address | Password
          
        1. keb = keb@gmail.com | Password1!
        2. bestTyper = ilied@gmail.com | Password2!
        3. chronicallyOnline = sleep@gmail.com | Password3!
        4. gamer123 = bestgamer@gmail.com | Password4!


