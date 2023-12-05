import { Router } from "express";
import { users } from "../config/mongoCollections.js";
const router = Router();
import validateFuncs from "../helpers/validation.js";
import UserFuncs from "../data/users.js";

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

router.route("/register").get(async (req, res) => {
  res.render("register", { title: "Register" });
});
export default router;
