const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.status(422).json({
      message: "/GET undefined"
  });
});

//to authenticate
router.post('/', 
    authController._auth_checks, 
    authController.getAuth
);

/*
*   ==============================
*   COMMENT IT OUT IN PRODUCTION
*   ==============================
*/
//to register a new ADMIN
router.post('/create_admin',
    authController._auth_create_checks,
    authController.createAuth,
);

module.exports = router;
