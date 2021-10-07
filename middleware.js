const Campground = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema, reviewSchema, userSchema } = require('./validation_schema')
const AppError = require('./utils/AppError')

// Campground Form validation middleware
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new AppError(msg, 400);
    } else {
      next();
    }
}

// Review Form validation middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new AppError(msg, 400);
    } else {
      next();
    }
  }

// Register Form validation middleware
module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new AppError(msg, 400);
    } else {
      next();
    }
}

module.exports.LoginRequired = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.url = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds')
    }
    next(); 
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
      req.flash('error', "You don't have permission to do that.");
      return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
      req.flash('error', "You don't have permission to do that.");
      return res.redirect(`/campgrounds/${id}`)
    }
    next();
}