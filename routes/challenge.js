const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const verify = require('../utils/verify');

/* GET all the challenges. */
router.get('/', verify.user, challengeController.getAllChallenge);

/* Create a new Challenge [Only for admins] */
router.post('/', 
  verify.admin, //route only accessible by admins
  challengeController._challenge_checks, 
  challengeController.createChallenge);

/* For submitting the flag and checking it */
router.post('/submit_flag', 
  verify.user, 
  challengeController._flag_checks,
  challengeController.submitFlag);

/* For testing the flag and checking it */
router.post('/test_flag', 
  verify.admin, //route only accessible by admins
  challengeController._flag_checks,
  challengeController.testFlag);

module.exports = router;
