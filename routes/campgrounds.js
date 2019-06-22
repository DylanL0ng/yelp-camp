var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require('../middleware');
// ===============
//   CAMPGROUNDS
// ===============


router.get('/', function(req, res){
    res.render('landing');
})

router.get('/campgrounds', function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render('campgrounds/index', {campgrounds : allCampgrounds});
        }
    });
});

router.post('/campgrounds',middleware['isLoggedIn'], function(req, res){
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var price = req.body.price
    var newCampground = {
    name: name, 
    image: image,
    author: author,
    price: price,
    description: desc
    };
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err)
        } else {
            console.log(campground)
            // redirect back to campgrounds
            res.redirect('/campgrounds')
        }
    })
    
});

// CREATE A NEW CAMPGROUND

router.get('/campgrounds/new', middleware['isLoggedIn'], function(req, res){
   res.render('campgrounds/new') 
});

// Show Route
router.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            console.log(foundCampground)
               res.render('campgrounds/show', {campground: foundCampground});  
        }
    });
    
});

// edit campground route
router.get('/campgrounds/:id/edit',middleware['checkCampgroundOwnership'], function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground})
    });
});
    
// update campground route
router.put('/campgrounds/:id',  function(req,res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id , req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        } else{
            req.flash('success', 'Campground Updated!')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
    // redirect somewhere(show page)
});

// Destroy CAMPGROUND Route
router.delete('/campgrounds/:id', middleware['checkCampgroundOwnership'], function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
            req.flash('error', 'Campground Deleted!')
            res.redirect('/campgrounds')
    })
});

module.exports = router;


