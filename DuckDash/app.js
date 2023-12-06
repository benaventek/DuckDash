//Here is where you'll set up your server as shown in lecture code
import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import middlewareFunctions from "./helpers/middleware.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//added authstate cookie for authetnication
app.use(express.json());
app.use(
  session({
    name: "AuthState",
    secret: "Authentication!",
    resave: false,
    saveUninitialized: true,
  })
);

app.all("*", middlewareFunctions.isLoggedIn);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
