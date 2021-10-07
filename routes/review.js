const express = require('express')
const router = express.Router( {mergeParams: true});
const Campground = require('../models/campground')
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync')
const { LoginRequired, isReviewAuthor, validateReview }  = require('../middleware');
const reviews = require('../controllers/reviews');

// Post a reviews
router.post('/',validateReview, LoginRequired, catchAsync(reviews.createReview))
  
// Delete a review
router.delete('/:reviewId', LoginRequired, isReviewAuthor, catchAsync(reviews.deleteReview))
  
module.exports = router;