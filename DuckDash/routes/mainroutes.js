import { Router } from "express";
import presetTestFuncs from "../data/presetTests.js";
const router = Router();
import validateFuncs from "../helpers/validation.js";
import UserFuncs from "../data/users.js";
import RequestFuncs from "../data/requests.js";
import * as validator from "email-validator";
import { requests } from "../config/mongoCollections.js";
import commentFuncs from "../data/comments.js";
import resultFuncs from "../data/results.js";
import xss from "xss";

router
  .route("/")
  .get(async (req, res) => {
    let tests = await presetTestFuncs.getAllTests();
    let cookie = JSON.stringify(null);
    if (req.session.user) {
      cookie = JSON.stringify(req.session.user);
    }
    res.render("home", {
      title: "DuckDash Homepage",
      partial: "typingTest_script",
      tests: JSON.stringify(tests),
      sessionCookie: cookie,
    });
  })
  .post(async (req, res) => {
    let wpm = req.body.wpm;
    wpm = wpm.replace(" WPM", "");
    let accuracy = req.body.accuracy;
    accuracy = accuracy.replace("%", "");
    try {
      let insertedResult = await resultFuncs.addResult(
        req.body.testType,
        req.body.testId,
        req.body.userId,
        wpm,
        accuracy
      );
      await UserFuncs.updateUser(
        req.session.user.displayname,
        "TestResultsList",
        insertedResult.toString()
      );
    } catch (error) {
      console.log(error);
    }
  });

router.route("/leaderboard").get(async (req, res) => {
  //Leaderboard initially loads with WPM Selected
  try {
    const results = await UserFuncs.getUsersByAverageWPM();
    if (results) {
      res.render("leaderboard", {
        title: "Leaderboards",
        wpmTrue: 'true',
        results: results,
        partial: "leaderboard_script",
      });
    } else {
      return res.status(500).render("leaderboard", {
        title: "Leaderboards",
        partial: "leaderboard_script",
        error: "Internal Server Error",
      });
    }
  } catch (e) {
    return res.status(400).render("leaderboard", {
      title: "Leaderboards",
      partial: "leaderboard_script",
      error: e,
    });
  }
});

router.route("/leaderboard/wpm/average")
  .post(async (req, res) => {
    //Leaderboard initially loads with WPM Selected
    try{
      const results = await UserFuncs.getUsersByAverageWPM();
      if(results){
        res.render("partials/leaderboard_template", {layout: null,results: results});
      }
      else{
        return res.status(500).render("leaderboard", {
          title: "Leaderboards",
          partial: "leaderboard_script",
          error: "Internal Server Error",
        });
      }
    } catch(e){
      return res.status(400).render("leaderboard", {
        title: "Leaderboards",
        partial: "leaderboard_script",
        error: "Internal Server Error",
      });
    }
});

router.route("/leaderboard/accuracy/average")
  .post(async (req, res) => {
    //Leaderboard initially loads with WPM Selected
    try{
      const results = await UserFuncs.getUsersByAverageAccuracy();
      if(results){
        res.render("partials/leaderboard_template", {layout: null, results: results});
      }
      else{
        return res.status(500).render("leaderboard", {
          title: "Leaderboards",
          partial: "leaderboard_script",
          error: "Internal Server Error",
        });
      }
    } catch(e){
      return res.status(400).render("leaderboard", {
        title: "Leaderboards",
        partial: "leaderboard_script",
        error: "Internal Server Error",
      });
    }
});

router.route("/leaderboard/wpm/:testTitle")
  .post(async (req, res) => {
    //Leaderboard initially loads with WPM Selected
    if (!req.params.testTitle){
      return res.status(404).render("error", { title: "Error" });
    }

    let testTitle = req.params.testTitle;
    if(testTitle=== 'pledge'){
      testTitle = 'Honor Pledge';

    }
    if(testTitle=== 'star'){
      testTitle = 'Twinkle Twinkle Little Star';

    }
    if(testTitle=== 'alphabet'){
      testTitle = 'Alphabet';

    }
    if(testTitle=== 'gold'){
      testTitle = 'Gold Digger';

    }
    
    try{
      const results = await UserFuncs.getUsersWPMByTestTitle(testTitle);
      if(results){
        res.render("partials/leaderboard_template", {layout: null, results: results});
      }
      else{
        return res.status(500).render("leaderboard", {
          title: "Leaderboards",
          partial: "leaderboard_script",
          error: "Internal Server Error",
        });
      }
    } catch(e){
      return res.status(400).render("leaderboard", {
        title: "Leaderboards",
        partial: "leaderboard_script",
        error: e,
      });
    }
});

router.route("/leaderboard/accuracy/:testTitle")
  .post(async (req, res) => {
    if (!req.params.testTitle){
      return res.status(404).render("error", { title: "Error" });
    }

    let testTitle = req.params.testTitle;
    if(testTitle=== 'pledge'){
      testTitle = 'Honor Pledge';

    }
    if(testTitle=== 'star'){
      testTitle = 'Twinkle Twinkle Little Star';

    }
    if(testTitle=== 'alphabet'){
      testTitle = 'Alphabet';

    }
    if(testTitle=== 'gold'){
      testTitle = 'Gold Digger';

    }
    try{
      const results = await UserFuncs.getUsersAccByTestTitle(testTitle);
      if(results){
        res.render("partials/leaderboard_template", {layout: null, results: results});
      }
      else{
        return res.status(500).render("leaderboard", {
          title: "Leaderboards",
          partial: "leaderboard_script",
          error: "Internal Server Error",
        });
      }
    } catch(e){
      return res.status(400).render("leaderboard", {
        title: "Leaderboards",
        partial: "leaderboard_script",
        error: e,
      });
    }
});

router
  .route("/search")
  .get(async (req, res) => {
    res.render("search", {
      title: "Search",
      partial: "profileLookup_script",
    });
  })
  .post(async (req, res) => {
    if (!req.body.displayname) {
      return res.status(400).render("search", {
        title: "Search",
        partial: "profileLookup_script",
        error: "Missing Display Name",
      });
    }
    try {
      req.body.displayname = validateFuncs.validdisplayname(
        req.body.displayname
      );
    } catch (e) {
      return res.status(400).render("search", {
        title: "Search",
        partial: "profileLookup_script",
        error: e,
      });
    }
    const cleandisplayname = xss(req.body.displayname);

    try {
      let userInfo = await UserFuncs.getUserBydisplayname(cleandisplayname);
      if (userInfo) {
        res.render("partials/profileLookup", { layout: null, ...userInfo });
      } else {
        return res.status(500).render("search", {
          title: "Search",
          partial: "profileLookup_script",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("search", {
        title: "Search",
        partial: "profileLookup_script",
        error: e,
      });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    res.render("login", { title: "Login" });
  })
  .post(async (req, res) => {
    if (!req.body.emailAddressInput) {
      return res.status(400).render("login", {
        title: "Login",
        error: "Missing email address",
      });
    }
    if (!req.body.passwordInput) {
      return res
        .status(400)
        .render("login", { title: "Login", error: "Missing password" });
    }
    req.body.emailAddressInput = req.body.emailAddressInput.trim();
    req.body.passwordInput = req.body.passwordInput.trim();
    req.body.emailAddressInput = req.body.emailAddressInput.toLowerCase();
    let errorCheck = validateFuncs.validateRegisterInput(
      "NodisplaynameNeeded",
      req.body.emailAddressInput,
      req.body.passwordInput
    );
    if (errorCheck.isValid === false) {
      return res.status(400).render("login", {
        title: "Login",
        error: "Invalid user inputs" + JSON.stringify(errorCheck.errors),
      });
    }
    try {
      let DbInfo = await UserFuncs.loginUser(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      req.session.user = DbInfo;
      if (DbInfo) {
        return res.redirect("/");
      } else {
        return res.status(500).render("login", {
          title: "Login",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("login", {
        title: "Login",
        error: e.message,
      });
    }
  });

router
  .route("/register")
  .get(async (req, res) => {
    res.render("register", { title: "Register" });
  })
  .post(async (req, res) => {
    if (!req.body.emailAddressInput) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Missing email address",
      });
    }
    if (!req.body.passwordInput) {
      return res
        .status(400)
        .render("register", { title: "Register", error: "Missing password" });
    }
    if (!req.body.confirmPasswordInput) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Missing confirm password",
      });
    }

    req.body.emailAddressInput = req.body.emailAddressInput.trim();
    req.body.passwordInput = req.body.passwordInput.trim();
    req.body.confirmPasswordInput = req.body.confirmPasswordInput.trim();

    validator.validate(req.body.emailAddressInput);
    let errorCheck = validateFuncs.validateRegisterInput(
      req.body.displaynameInput,
      req.body.emailAddressInput,
      req.body.passwordInput
    );
    req.body.emailAddressInput = req.body.emailAddressInput.toLowerCase();
    if (errorCheck.isValid === false) {
      return res.status(400).render("Register", {
        title: "Register",
        error: "Invalid user inputs" + JSON.stringify(errorCheck.errors),
      });
    }
    try {
      let DbInfo = await UserFuncs.registerUser(
        req.body.displaynameInput,
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      if (DbInfo) {
        return res.redirect("/login");
      } else {
        return res.status(500).render("register", {
          title: "Register",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("register", {
        title: "Register",
        error: e.message,
      });
    }
  });
router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router
  .route("/profile")
  .get(async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    try {
      let PendingFriendRequests =
        await RequestFuncs.getPendingRequestsbyRecieverId(
          req.session.user.userID.toString()
        );
      let friends = [];
      for (const friend of req.session.user.friendsList) {
        let Frienddisplayname = await UserFuncs.getUserById(friend.toString());
        friends.push(Frienddisplayname.displayname);
      }

      let comments = await commentFuncs.getCommentByprofileId(
        req.session.user.userID.toString()
      );
      let tests = [];
      let AverageWPM = 0;
      let AverageAccuracy = 0;
      if (req.session.user.testResultsList) {
        for (const result of req.session.user.testResultsList
          .slice(Math.max(req.session.user.testResultsList.length - 5, 0))
          .reverse()) {
          let resultInfo = await resultFuncs.getResultByID(result);
          let testInfo = {};
          if (resultInfo.testID == null) {
            testInfo.testTitle = "Random Test";
          } else {
            testInfo = await presetTestFuncs.getTestById(
              resultInfo.testID.toString()
            );
          }

          tests.push({
            testTitle: testInfo.testTitle,
            Accuracy: resultInfo.accuracy,
            WPM: resultInfo.wpm,
          });
        }
        let i = 0;

        let AllUsersResults = await resultFuncs.getResultsBydisplayname(
          req.session.user.displayname
        );
        for (const result of AllUsersResults) {
          i++;
          AverageWPM += +result.wpm;
          AverageAccuracy += +result.accuracy;
        }
        if (i != 0) {
          AverageWPM = AverageWPM / i;
          AverageAccuracy = AverageAccuracy / i;
        }
      }
      res.render("profilePage", {
        title: "Profile",
        partial: "profilePage_script",
        tests: tests,
        friends: friends,
        displayname: req.session.user.displayname,
        userId: req.session.user.userID,
        userBio: req.session.user.userBio,
        profilePictureUrl: req.session.user.profilePictureUrl,
        PendingFriendRequests: PendingFriendRequests,
        comments: comments,
        AverageWPM: AverageWPM.toFixed(2),
        AverageAccuracy: AverageAccuracy.toFixed(2),
      });
    } catch (error) {
      return res.status(404).render("error", { title: "404", Error: error });
    }
  })
  .post(async (req, res, next) => {
    try {
      await UserFuncs.updateUser(
        req.session.user.displayname,
        "Bio",
        req.body.bioInput
      );
      res.redirect("/profile");
    } catch (error) {
      return res.status(404).render("error", { title: "404", Error: error });
    }
  });
router
  .route("/profile/:displayname")
  .get(async (req, res, next) => {
    if (!req.params.displayname)
      return res.status(404).render("error", { title: "Error" });
    console.log(req.params.displayname);
    try {
      let user = await UserFuncs.getUserBydisplayname(req.params.displayname);
      let isFriend = false;
      let isPending = false;
      if (req.session.user) {
        if (req.session.user.displayname == user.displayname) {
          return res.redirect("/profile");
        }
        for (const friend of user.friendsList) {
          if (friend.toString() == req.session.user.userID.toString()) {
            isFriend = true;
          }
        }
        let pendingRequests = await RequestFuncs.getPendingRequestsbyRecieverId(
          user.userID.toString()
        );
        console.log(pendingRequests);
        for (const request of pendingRequests) {
          if (request.userId == req.session.user.userID.toString()) {
            isPending = true;
          }
        }
      }

      let comments = await commentFuncs.getCommentByprofileId(
        user.userID.toString()
      );
      let tests = [];
      let AverageWPM = 0;
      let AverageAccuracy = 0;
      if (user.testResultsList) {
        for (const result of user.testResultsList
          .slice(Math.max(user.testResultsList.length - 5, 0))
          .reverse()) {
          let resultInfo = await resultFuncs.getResultByID(result);
          let testInfo = {};
          if (resultInfo.testID == null) {
            testInfo.testTitle = "Random Test";
          } else {
            testInfo = await presetTestFuncs.getTestById(
              resultInfo.testID.toString()
            );
          }

          tests.push({
            testTitle: testInfo.testTitle,
            Accuracy: resultInfo.accuracy,
            WPM: resultInfo.wpm,
          });
        }
        let i = 0;
        let AllUsersResults = await resultFuncs.getResultsBydisplayname(
          user.displayname
        );
        for (const result of AllUsersResults) {
          i++;
          AverageWPM += +result.wpm;
          AverageAccuracy += +result.accuracy;
        }
        if (i != 0) {
          AverageWPM = AverageWPM / i;
          AverageAccuracy = AverageAccuracy / i;
        }
      }
      res.render("profilePage_id", {
        title: "Profile",
        partial: "profilePage_id_script",
        tests: tests,
        displayname: user.displayname,
        userId: user.userID,
        userBio: user.userBio,
        profilePictureUrl: user.profilePictureUrl,
        showRequestButton: !isFriend && !isPending,
        comments: comments,
        AverageWPM: AverageWPM.toFixed(2),
        AverageAccuracy: AverageAccuracy.toFixed(2),
      });
    } catch (error) {
      console.log(error);
      return res.status(404).render("error", { title: "404", Error: error });
    }
  })
  .post(async (req, res, next) => {
    if (req.session.user) {
      try {
        let requestedUser = await UserFuncs.getUserBydisplayname(
          req.body.displayname
        );

        await RequestFuncs.addRequest(
          req.session.user.userID.toString(),
          requestedUser.userID.toString()
        );
        res.redirect("/profile/" + requestedUser.displayname);
      } catch (error) {
        return res.status(404).render("error", { title: "404", Error: error });
      }
    } else {
      return res.redirect("/login");
    }
  });
router.route("/acceptFriendRequest").post(async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  try {
    await RequestFuncs.acceptFriendRequest(
      req.body.FriendRequestId,
      req.session.user.userID.toString()
    );
    res.redirect("/profile");
  } catch (error) {
    return res.status(404).render("error", { title: "404", Error: error });
  }
});
router.route("/declineFriendRequest").post(async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  try {
    const userCollection = await requests();
    await userCollection.deleteOne({
      sender: req.body.FriendRequestId,
    });
    res.redirect("/profile");
  } catch (error) {
    return res.status(404).render("error", { title: "404", Error: error });
  }
});
router.route("/postComment").post(async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  let currProfile = await UserFuncs.getUserById(req.body.profileId.toString());
  try {
    let comment = await commentFuncs.addComment(
      req.session.user.userID.toString(),
      req.body.commentInput,
      req.body.profileId.toString()
    );
    res.redirect("/profile/" + currProfile.displayname);
  } catch (error) {
    return res.status(404).render("error", { title: "404", Error: error });
  }
});
router.route("/deleteComment").post(async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  let currProfile = await UserFuncs.getUserById(req.body.profileId.toString());
  try {
    let comment = await commentFuncs.deleteCommentsById(
      req.body.commentId.toString()
    );
    res.redirect("/profile/" + currProfile.displayname);
  } catch (error) {
    return res.status(404).render("error", { title: "404", Error: error });
  }
});
export default router;
