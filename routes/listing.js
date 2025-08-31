const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })


router.route("/").get(WrapAsync(listingController.index)).post(isLoggedIn, upload.single("listing[image]"),validateListing, WrapAsync(listingController.createListings));

router.get("/new", isLoggedIn, listingController.renderNewForm)


router.route("/:id").get(WrapAsync(listingController.showListing)
).put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, WrapAsync(listingController.updateListings)).delete( isLoggedIn, isOwner, WrapAsync(listingController.deleteListings)
);

//edit Route
router.get("/:id/edit",isLoggedIn,isOwner, WrapAsync(listingController.editListings)
);



//Index Route
// router.get("/", WrapAsync(listingController.index));

//New Route

//Show Route
// router.get("/:id", WrapAsync(listingController.showListing)
// );

//Create Route
// router.post("/", isLoggedIn, validateListing, WrapAsync(listingController.createListings));

//update route

// router.put("/:id", isLoggedIn, isOwner, validateListing, WrapAsync(listingController.updateListings));

//Delete Route

// router.delete("/:id", isLoggedIn, isOwner, WrapAsync(listingController.deleteListings)
// );

module.exports = router;