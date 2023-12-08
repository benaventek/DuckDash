import mainRoutes from "./mainroutes.js";

const constructorMethod = (app) => {
  app.use("/", mainRoutes);
  app.use("/leaderboard", mainRoutes);
  app.use("/search", mainRoutes);
  app.use("/login", mainRoutes);
  app.use("/register", mainRoutes);
  app.use("/profile", mainRoutes);
  app.use("/profile/:id", mainRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
