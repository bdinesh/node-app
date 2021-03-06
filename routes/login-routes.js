const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const {
    catchErrors
} = require('../handlers/errorHandlers');

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register', 
    userController.validateRegister, 
    catchErrors(userController.register),
    authController.login
);

router.get('/logout', authController.logout);

router.get('/account', 
    authController.isLoggedIn, 
    userController.account
);

router.post('/account', catchErrors(userController.updateAccount));

router.post('/account/forgotpassword', 
    catchErrors(authController.forgotPassword)
);

router.get('/account/reset/:token',
    catchErrors(authController.redirectIfInvalidToken),
    catchErrors(authController.resetPassword)
);

router.post('/account/reset/:token',
    catchErrors(authController.redirectIfInvalidToken),
    catchErrors(authController.updatePassword)
);

module.exports = router;