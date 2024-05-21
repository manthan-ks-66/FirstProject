const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Utilities/wrapAsync.js");
const ExpressError = require("../Utilities/ExpressError.js");
const Review = require("../models/reviews.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const controller = require("../controller/allReviews.js")


// Review validation
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}



// POST Route for review submission
router.post("/", isLoggedIn, validateReview, wrapAsync(controller.submitReview));



// Delete Review 
router.delete("/:reviewId", isLoggedIn, wrapAsync(controller.deleteReview))

module.exports = router;