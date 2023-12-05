import { Router } from "express";
const router = Router();
import validateFuncs from "../helpers/validation.js";
import UserFuncs from "../data/users.js";
import * as validator from "email-validator";

router.route("/").get(async (req, res) => {
  res.render("home", { title: "DuckDash Homepage" });
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
        return res.redirect("/home");
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
    if (!req.body.firstNameInput) {
      return res
        .status(400)
        .render("register", { title: "Register", error: "Missing first name" });
    }
    if (!req.body.lastNameInput) {
      return res
        .status(400)
        .render("register", { title: "Register", error: "Missing last name" });
    }
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
    req.body.firstNameInput = req.body.firstNameInput.trim();
    req.body.lastNameInput = req.body.lastNameInput.trim();
    req.body.emailAddressInput = req.body.emailAddressInput.trim();
    req.body.passwordInput = req.body.passwordInput.trim();
    req.body.confirmPasswordInput = req.body.confirmPasswordInput.trim();
    if (
      req.body.firstNameInput.length < 2 ||
      req.body.firstNameInput.length > 25
    ) {
      return res.status(400).render("register", {
        title: "Register",
        error: "First name should be atleast 2 characters long",
      });
    }
    if (
      req.body.lastNameInput.length < 2 ||
      req.body.lastNameInput.length > 25
    ) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Last name should be atleast 2 characters long",
      });
    }
    if (/\d/.test(req.body.firstNameInput)) {
      return res.status(400).render("register", {
        title: "Register",
        error: "First name should not contain numbers",
      });
    }
    if (/\d/.test(req.body.lastNameInput)) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Last name should not contain numbers",
      });
    }
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
        req.body.firstNameInput,
        req.body.lastNameInput,
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
export default router;
