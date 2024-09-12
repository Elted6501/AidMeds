import express from "express";
import morgan from "morgan";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import passport from "passport";
import flash from "connect-flash";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import router from "./routes/routes.js";
import post from "./routes/postes.js";
import au from "./routes/authentications.js";
import pool from "./db.js";
import cl from "./lib/cloudinary.js";

// Initializations
const app = express();
import "./lib/passport.js";

// Settings
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/files"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(
  session({
    secret: "aidmedssessions",
    store: new (MySQLStore(session))(
      {
        clearExpired: true,
        expiration: 7200000,
        checkExpirationInterval: 1800000,
        createDatabaseTable: true,
      },
      pool
    ),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(
  multer({
    storage: storage,
    dest: path.join(__dirname, "public/files"),
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname));
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(null, false);
    },
  }).single("img")
);

// Global variables
app.use((req, res, next) => {
  app.locals.user = req.user;
  app.locals.message = req.flash("message");
  next();
});

// Routes
app.use(router);
app.use(post);
app.use(au);
app.use(cl);

// Public
app.use(express.static(path.join(__dirname, "public")));
app.listen(3000);
console.log("SERVER IS LISTENING ON PORT", 3000);