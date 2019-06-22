var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// ===========
// AUTH ROUTES
// ===========

// show register form
router.get('/register', function(req, res) {
    res.render('register')
});

// Handle Signup Logic
router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message)
            res.redirect('register')
        } else{
            passport.authenticate('local')(req, res,function(){
                req.flash('success', 'Welcome to YelpCamp: ' + user.username)
                res.redirect('/campgrounds')
            });
            console.log('created a user ' + user['username'])
        }
    });
});

// Show login form
router.get('/login', function(req, res) {
    res.render('login')
})
// handling login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds', 
    failureRedirect: '/login'
    
}), function(req, res) {
    
})

// Logout Route

router.get('/logout', function(req, res) {
    // req.session.destroy(function(err){
    //     if(err){
    //         console.log(err)
    //     } else{
    //         req.flash('error', 'Logged you out!');
    //         res.redirect('/campgrounds')
    //     }
    // })
    
    req.logout();
    req.flash('success', 'Logged you out!')
    res.redirect('/campgrounds')
    
})
// Checking if logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}

module.exports = router
