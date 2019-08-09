// This file contains all middlewares
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comments");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //Checks if User is Logged in or not
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err) {
                res.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // Checks whether the particular campground is owned by particular logged in user or not
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.flash("error", "You don't have the permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else{
        res.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //Checks if User is Logged in or not
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                // Checks whether the particular campground is owned by particular logged in user or not
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.flash("error", "You don't have the permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else{
        res.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;