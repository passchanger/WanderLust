const express = require("express");
const router = express.Router({ mergeParams : true});
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Review 
//post route
router.post("/",isLoggedIn, validateReview, WrapAsync(reviewController.postReview));

//Delete route 
router.delete("/:reviewId",isLoggedIn, isreviewAuthor, WrapAsync(reviewController.destroyReview));

module.exports = router;
