let middlewareFunctions = {
  isLoggedIn(req, res, next) {
    if (req.session.user) {
      res.locals.loggedin = true;
      res.locals.profilePic = req.session.user.profilePictureUrl;
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
