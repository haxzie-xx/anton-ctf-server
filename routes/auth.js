const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.status(422).json({
      message: "/GET undefined"
  });
});

router.post('/', authController._auth_checks, authController.getAuth);

module.exports = router;
