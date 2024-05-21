const Listing = require("../models/listing.js");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

// exporting home page controller
module.exports.home = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/home.ejs", { allListings });
};

// exporting new page controller
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

// exporting show page controller
module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exists!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// exporting create controller
module.exports.create = async (req, res) => {
  // storing the filename and url from cloudinary
  let filename = req.file.filename;
  let url = req.file.path;

  // storing the newly created listing details in newListing variable
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };

  // getting the coordiantes by forward geocoding
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // storing the geometry of the location
  newListing.geometry = response.body.features[0].geometry;

  // saving the new listing in database
  await newListing.save();
  req.flash("success", "New List Created!");

  // redirect to home page
  res.redirect("/listings");
};

// exporting listing edit controller
module.exports.edit = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

// exporting listing update controller
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;

    listing.image = { filename, url };
    listing.save();
  }

  req.flash("success", "List Updated!");
  res.redirect(`/listings/${id}`);
};

// exporting delete controller
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "List Deleted!");
  res.redirect("/listings");
};
