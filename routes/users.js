const express = require('express')
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const flash = require('connect-flash');
const { isLoggedIn, LoginRequired, validateUser } = require('../middleware');
const users = require('../controllers/users')

// New User registration form
router.route('/register')
    .get(isLoggedIn, users.renderRegisterForm)
    .post(validateUser, isLoggedIn, catchAsync(users.createUser))

// Log in 
router.route('/login')
    .get(isLoggedIn, users.renderLogin)
    .post(isLoggedIn, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), users.loginUser)

// Log out
router.get('/logout', LoginRequired, users.logout)

module.exports = router;
