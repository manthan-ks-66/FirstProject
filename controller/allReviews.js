const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");


// exporting post route for review submission
module.exports.submitReview = (async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let { id } = req.params;
    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    let newReview = new Review(req.body.review);

    if (!listing.reviews) {
        listing.reviews = []; // Initialize reviews array if it doesn't exist
    }
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${id}`);
})



// exporting delete review controller
module.exports.deleteReview = async(req, res) => {

    let { id , reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    
    res.redirect(`/listings/${id}`);
}