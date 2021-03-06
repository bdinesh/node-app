const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
//const authController = require('../controllers/authController');
const {
    catchErrors
} = require('../handlers/errorHandlers');

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/favorite', catchErrors(storeController.favoriteStore));


module.exports = router;