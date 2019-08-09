var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware/index");

// INDEX ROUTE - Campgrounds Page
router.get("/", function(req, res){
    //Retrive all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE ROUTE - Campgrounds POST route - Create a new Campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampgrounds = {name: name, price:price, image: image, description: description, author:author};
    Campground.create(newCampgrounds, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // Redirect back to Campgrounds page
            res.redirect("/");
        }
    });
});

// NEW ROUTE - Add new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW ROUTE - Shows more info about a particular Campground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE - Edit's the Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // Find the correct campground
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    }); 
});

// UPDATE ROUTE - Update the campground
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE - Deletes the Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;