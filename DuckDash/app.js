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

dotenv.config();
const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: "us-east-1",
};

const s3Client = new S3Client(s3Config);

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
  exphbs.engine({ defaultLayout: "main", partialsDir: ["views/partials/"] })
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
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file.data,
    ContentType: file.mimetype,
    CacheControl: "no-cache",
  };
  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
  } catch (err) {
    alert("Error uploading file: ", err);
  }
  try {
    await UserFuncs.updateUser(
      req.session.user.username,
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
