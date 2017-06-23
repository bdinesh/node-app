const passport = require('passport');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Login failed!',
    successRedirect: '/',
    successFlash: 'Welcome back!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/login');
};

exports.forgotPassword = async (req, res) => {
    // see if a user with that email exists
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        req.flash('Error', 'No account with that email exists!');
        
        return res.redirect('/login');
    }

    // set reset tokens and expiry on their account
    const oneHour = 3600000;
    
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpiry = Date.now() + oneHour;
    user.save();

    // send the reset token to user's email
    const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

    req.flash('success', `You have been emailed a password reset link. ${resetUrl}`);

    // redirect to login page
    res.redirect('/login');
};

const findUserWithResetToken = async (token) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: {
            $gt: Date.now()
        }
    });

    return user;
};

exports.redirectIfInvalidToken = async (req, res, next) => {
    const user = await findUserWithResetToken(req.params.token);

    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired');

        return res.redirect('/login');
    }

    next();
};

exports.resetPassword = async (req, res) => {
    res.render('resetPassword', {
        title: 'Reset Your Password'
    });
};

exports.checkPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        return next();
    }

    res.flash('error', 'Passwords do not match');
    res.redirect('back');
};

exports.updatePassword = async (req, res) => {
    const user = await findUserWithResetToken(req.params.token);
    const setPassword = promisify(user.setPassword, user);

    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    const updatedUser = await user.save();

    await req.login(updatedUser);
    req.flash('success', 'Password updated! You are now logged in.');
    res.redirect('/');
};