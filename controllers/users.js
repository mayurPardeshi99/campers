const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async(req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to campers!');
            res.redirect('/campgrounds')
        })
    } 
    catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
    
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.url || '/campgrounds';
    delete req.session.url;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds')
}