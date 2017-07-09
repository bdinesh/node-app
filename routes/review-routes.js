const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const {
    catchErrors
} = require('../handlers/errorHandlers');

router.post('/reviews/:id', 
    authController.isLoggedIn,
    catchErrors(reviewController.addReview)
);

module.exports = router;