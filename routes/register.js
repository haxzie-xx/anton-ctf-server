const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.status(422).json({
      message: "/GET undefined"
  });
});

router.post('/', userController._register_checks, userController.register);

module.exports = router;
