const express = require('express')
const router = express.Router();
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const { LoginRequired, isAuthor, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

// Show all campgrounds
router.get('/', catchAsync(campgrounds.index))

// Add new campground
router.route('/new')
  .get(LoginRequired, campgrounds.renderNewForm)
  .post(LoginRequired, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
  
// Show specific campgrounds in detail  
// Deletes a campground
router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .delete(LoginRequired, isAuthor, catchAsync(campgrounds.deleteCampground))

// Edit a campground details
router.route('/:id/edit')
  .get(LoginRequired, isAuthor, catchAsync(campgrounds.renderEditCampground))
  .put(LoginRequired, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

module.exports = router;