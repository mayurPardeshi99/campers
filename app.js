require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const AppError = require('./utils/AppError')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');

const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/users')

const app = express()

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(mongoSanitize());

// Database connection
main().then(console.log('DB connection open')).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/campersDB');
}

const sessionConfig = {
  secret: 'mysession',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash message middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// User
app.use('/', userRoutes)

// Campground routes
app.use('/campgrounds', campgroundRoutes)

// Review routes
app.use('/campgrounds/:id/review', reviewRoutes)

// Show home page
app.get('/', (req, res) => {
  res.render('home')
})

// Page not found
app.all('*', (req, res, next) => {
  next(new AppError("Page not found", 404))
})

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error', { err })
})


// Sets server on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000')
})