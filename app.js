var express = require("express"),
    methodOverride = require('method-override'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require("connect-flash"),
    localStrategy = require("passport-local"),
    Campground = require('./models/campground'),
    seedDB = require("./seeds"),
    User = require('./models/user'),
    Comment = require('./models/comment');
    
    
    // Requiring Routes
   var  commentRoutes        = require("./routes/comments"),
        campgroundRoutes    = require('./routes/campgrounds'),
        authRoutes          = require("./routes/auth")
    
    // ADD MONGODB
    mongoose.connect("mongodb+srv://admin:" + encodeURIComponent('gTg37Rlu%#h4') + "@cluster0-kv9tg.mongodb.net/test?retryWrites=true&w=majority", 
    { useNewUrlParser: true,
      useCreateIndex: true
    
    }).then(() =>{
    console.log('Connected to DB!');
    }).catch(err => {
    console.log('ERROR:', err.message);
    });



app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());



// Seed the database
//  seedDB();
 
//  PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'guess what i have a secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(authRoutes);
app.use(commentRoutes)
app.use(campgroundRoutes)


app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log('YelpCamp Has Started')
})