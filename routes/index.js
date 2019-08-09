var express  = require("express");
var router   = express.Router();
var User     = require("../models/users");
var passport = require("passport");

// Home Route
router.get("/", function(req, res){
    res.render("landing");
});

//Show's Register Form
router.get("/register", function(req, res){
    res.render("register");
});

//Register's the new User
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            res.render("register", {Error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            // res.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Show's Login Form
router.get("/login", function(req, res){
    res.render("login");
});

//Log's User in
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;