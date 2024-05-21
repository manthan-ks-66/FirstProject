const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utilities/wrapAsync.js");
const ExpressError = require("../Utilities/ExpressError.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/tilesets");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });
const controller = require("../controller/allListings.js");

// Listing validation
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Home Route
router.get("/", wrapAsync(controller.home));

// New Route
router.get("/new", isLoggedIn, controller.new);

// Show Route
router.get("/:id", wrapAsync(controller.show));

// Create Route
router.post("/", upload.single("listing[image]"), wrapAsync(controller.create));

// Edit Route (rendering edit form)
router.get("/:id/edit", isLoggedIn, wrapAsync(controller.edit));

// Update Route (updating in database)
router.put(
  "/:id",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(controller.update)
);

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(controller.delete));

module.exports = router;
