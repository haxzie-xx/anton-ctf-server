const router = require('express').Router();
const eventController = require('../controllers/event.controller');
const jwt_secret = process.env.JWT_SECRET || require('../utils/config').JWT_SECRET;
const verify = require('../utils/verify');

router.get('/', verify.user, (req, res) => {
    res.status(200).json({
        message: `Hello from events`
    });
});

router.post('/', verify.user, (req, res) => {
    res.status(200).json({
        message: `Hello from events`
    });
});

module.exports = router;