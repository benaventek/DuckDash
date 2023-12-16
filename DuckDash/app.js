//Here is where you'll set up your server as shown in lecture code
import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import middlewareFunctions from "./helpers/middleware.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import exphbs from "express-handlebars";
import fileUpload from "express-fileupload";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import UserFuncs from "./data/users.js";
process.env.AWS_SDK_LOAD_CONFIG = "1";

dotenv.config();

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRETE_ACCESS_KEY,
  },
});

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

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    partialsDir: ["views/partials/"],
    helpers: {
      exists: (value) => {
        if (value.length != 0) return true;
        else return false;
      },
    },
  })
);
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
app.use(middlewareFunctions.isLoggedIn);
app.use(fileUpload());

app.post("/upload", async (req, res) => {
  const file = req.files.imageUpload;
  const fileName = "UserProfilePictures_" + req.session.user.userID + ".png";
  const bucketParams = {
    Bucket: "duckdashbucket",
    Key: fileName,
    Body: file.data,
    ContentType: file.mimetype,
    CacheControl: "no-cache",
  };
  try {
    const data = await client.send(new PutObjectCommand(bucketParams));
  } catch (err) {
    console.log(err);
  }
  try {
    await UserFuncs.updateUser(
      req.session.user.displayname,
      "ProfilePictureUrl",
      "https://duckdashbucket.s3.amazonaws.com/UserProfilePictures_" +
        req.session.user.userID +
        ".png"
    );
  } catch (error) {
    alert("Error updating user ", error);
  }

  res.redirect("/profile");
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
