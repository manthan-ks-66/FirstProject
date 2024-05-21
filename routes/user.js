const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// SignUp User (Form)
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// SignUp User (Authentication)
router.post("/signup", async (req, res) => {

    try {

        let {username , email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }

            req.flash("success", "You are registered! Welcome to ExploreSphere");
            res.redirect("/listings");
        })


    } catch(err) {
        req.flash("error", err.message);
    }
});

// Login User (form)
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login User (Authentication)
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true, }), async(req, res) => {
    req.flash("success", "Welcome back! to ExploreSphere");

    let redirectUrl = res.locals.redirectURL || "/listings";
     res.redirect(redirectUrl);
});

// Logout User
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next();
        }
        else {
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        }
    })
})

module.exports = router;