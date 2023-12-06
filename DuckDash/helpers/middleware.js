//TODO FIX THIS MIDDLEWARE
import UserFuncs from "../data/users.js";
let middlewareFunctions = {
  async isLoggedIn(req, res, next) {
    if (req.session.user) {
      //update user info
      req.session.user = await UserFuncs.getUserById(req.session.user.userID);
      res.locals.loggedin = true;
      if (req.path == "/login" || req.path == "/register") {
        return res.redirect("/home");
      }
    } else if (req.path == "/profile") {
      return res.redirect("/login");
    }
    next();
  },
};
export default middlewareFunctions;
