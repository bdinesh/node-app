const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
    res.send('Welcome to Express!');
});

router.get('/add', (req, res) => {
    res.render('editStore', {title: 'Add Store'});
});

module.exports = router;
