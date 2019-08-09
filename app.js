var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodeOverride = require("method-override"),
    User          = require("./models/users");
    //seedDB        = require("./seeds");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

// Application Configuration
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodeOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());
//seedDB(); // Seed's the database

// Passport Configuration
app.use(require("express-session")({
    secret: "This is my first web app that I am crating from Scratch",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.Error = req.flash("error");
    res.locals.Success = req.flash("success");
    next();
});

// Routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen("3000", function(){
    console.log("The YelpCamp Server has started!!");
});