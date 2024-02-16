import { Router } from "express";
import passport from "passport";
import helpers from "../lib/helpers.js";

const au = Router();

au.post('/signup', passport.authenticate('local.signup', { 
    successRedirect: '/cuentacreada', 
    failureRedirect: '/layout', 
    failureFlash: true
}));

au.post('/login', (req, res, next) => { passport.authenticate('local.signin', {
        successRedirect: '/user',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

au.get('/user/logout', helpers.isLoggedIn, (req, res) => {
    req.logOut((err) => { });
    res.redirect('/login');
});

export default au;