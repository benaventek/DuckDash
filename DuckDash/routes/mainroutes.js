import { Router } from "express";
import presetTestFuncs from "../data/presetTests.js";
const router = Router();
import validateFuncs from "../helpers/validation.js";
import UserFuncs from "../data/users.js";
import RequestFuncs from "../data/requests.js";
import * as validator from "email-validator";
import { requests } from "../config/mongoCollections.js";

router.route("/").get(async (req, res) => {
  let tests = await presetTestFuncs.getAllTests();
  res.render("home", {
    title: "DuckDash Homepage",
    partial: "typingTest_script",
    tests: JSON.stringify(tests),
  });
});

router.route("/leaderboard").get(async (req, res) => {
  res.render("leaderboard", { title: "Leaderboards" });
});

router.route("/search").get(async (req, res) => {
  res.render("search", { title: "Search" });
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
      "NoUsernameNeeded",
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
      req.body.usernameInput,
      req.body.emailAddressInput,
      req.body.passwordInput
    );
    if (errorCheck.isValid === false) {
      return res.status(400).render("Register", {
        title: "Register",
        error: "Invalid user inputs" + JSON.stringify(errorCheck.errors),
      });
    }
    try {
      let DbInfo = await UserFuncs.registerUser(
        req.body.usernameInput,
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
        let FriendUsername = await UserFuncs.getUserById(friend.toString());
        friends.push(FriendUsername.username);
      }

      res.render("profilePage", {
        title: "Profile",
        partial: "profilePage_script",
        tests: req.session.user.testResultsList,
        friends: friends,
        username: req.session.user.username,
        userBio: req.session.user.userBio,
        profilePictureUrl: req.session.user.profilePictureUrl,
        PendingFriendRequests: PendingFriendRequests,
      });
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      await UserFuncs.updateUser(
        req.session.user.username,
        "Bio",
        req.body.bioInput
      );
      res.redirect("/profile");
    } catch (error) {
      return res.status(404).render("error", { title: "404", Error: error });
    }
  });
router
  .route("/profile/:username")
  .get(async (req, res, next) => {
    if (!req.params.username)
      return res.status(404).render("error", { title: "Error" });
    try {
      let user = await UserFuncs.getUserByUsername(
        req.params.username.toLowerCase()
      );
      let isFriend = false;
      let isPending = false;
      if (req.session.user) {
        if (req.session.user.username == user.username) {
          return res.redirect("/profile");
        }
        for (const friend of user.friendsList) {
          if (friend.toString() == req.session.user.userID.toString()) {
            isFriend = true;
          }
        }
        let pendingRequests = await RequestFuncs.getPendingRequestsbyRecieverId(
          req.session.user.userID.toString()
        );
        for (const request of pendingRequests) {
          if (request.userId == user.userID.toString()) {
            isPending = true;
          }
        }
      }
      res.render("profilePage_id", {
        title: "Profile",
        partial: "profilePage_id_script",
        tests: user.testResultsList,
        username: user.username,
        userBio: user.userBio,
        profilePictureUrl: user.profilePictureUrl,
        showRequestButton: !isFriend && !isPending,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).render("error", { title: "404", Error: error });
    }
  })
  .post(async (req, res, next) => {
    if (req.session.user) {
      try {
        let requestedUser = await UserFuncs.getUserByUsername(
          req.body.username.toLowerCase()
        );

        await RequestFuncs.addRequest(
          req.session.user.userID.toString(),
          requestedUser.userID.toString()
        );

        res.render("profilePage_id", {
          title: "Profile",
          partial: "profilePage_id_script",
          username: requestedUser.username,
          userBio: requestedUser.userBio,
          profilePictureUrl: requestedUser.profilePictureUrl,
        });
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
export default router;
