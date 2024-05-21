if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./Utilities/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

// MongoDB Connection URL
const Mongo_Url = process.env.ATLAS_URL;

const store = MongoStore.create({
  mongoUrl: Mongo_Url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionCode = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 4 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join("views"));
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

// MongoDB Connection.
async function main() {
  await mongoose.connect(Mongo_Url);
}
main()
  .then(() => {
    console.log("DB Connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Express Session Implementation
app.use(session(sessionCode));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// success and error flash message
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Listings Router
app.use("/listings", listingRouter);

// Reviews Router
app.use("/listings/:id/reviews", reviewRouter);

// User Router
app.use("/", userRouter);

// farm hosue category
app.get("/farm-houses", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/farmHouse.ejs", { allListings });
});

// trending category
app.get("/trending", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/trending.ejs", { allListings });
});

// iconic city category
app.get("/iconiccity", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/IconicCity.ejs", { allListings });
});

// mountiains category
app.get("/mountains", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/mountains.ejs", { allListings });
});

// hill stations category
app.get("/hillstations", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/hillStations.ejs", { allListings });
});

// camping category
app.get("/camping", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/camping.ejs", { allListings });
});

// rooms category
app.get("/rooms", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/rooms.ejs", { allListings });
});

// castle category
app.get("/castle", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/castle.ejs", { allListings });
});

// 404 error (page not found!)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND! "));
});

// error
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("listings/Error.ejs", { message });
});
