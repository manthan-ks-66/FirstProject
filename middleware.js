const Review  = require("./models/reviews.js");
const Listing = require("./models/listing.js");

module.exports.isLoggedIn = (req, res, next) => {

    if(!req.isAuthenticated()) {

        req.session.redirectURL = req.originalUrl;

        req.flash("error", "Please Login to continue");

        return res.redirect("/login");

    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {

    if(req.session.redirectURL) {

        res.locals.redirectURL = req.session.redirectURL;

    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of the this review");
        return res.redirect(`/listings/${id}`);
    }
}