import { Router } from "express";
import presetTestFuncs from "../data/presetTests.js";
const router = Router();
import validateFuncs from "../helpers/validation.js";
import UserFuncs from "../data/users.js";
import * as validator from "email-validator";

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
    res.render("profilePage", {
      title: "Profile",
      partial: "profilePage_script",
      username: req.session.user.username,
      userBio: req.session.user.userBio,
      profilePictureUrl: req.session.user.profilePictureUrl,
    });
  })
  //FIX THIS
  .post(async (req, res, next) => {
    let selection = req.body.selection;
    await UserFuncs.updateUser(
      req.session.user.username,
      "Bio",
      req.body.bioInput
    );
    res.redirect("/profile");
  });

export default router;
