const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const verify = require('../utils/verify');


//=============================================================================
/* GET all the challenges. */
router.get('/', verify.user, challengeController.getAllChallenge);

/* GET a Challenge */
router.get('/:id', 
  verify.user,
  challengeController.getChallenge);

/* For submitting the flag and checking it */
router.post('/submit_flag', 
  verify.user, 
  challengeController._flag_checks,
  challengeController.submitFlag);

//=======================================================================

/* Create a new Challenge [Only for admins] */
router.post('/', 
  verify.admin, //route only accessible by admins
  challengeController._challenge_checks, 
  challengeController.createChallenge);

/* Edit a Challenge [Only for admins] */
router.post('/:id', 
  verify.admin, //route only accessible by admins
  challengeController._challenge_update_checks, 
  challengeController.editChallenge);

/* For testing the flag and checking it [ONLY FOR ADMINS] */
router.post('/test_flag', 
  verify.admin, //route only accessible by admins
  challengeController._flag_checks,
  challengeController.testFlag);

/* For deleting a challenge
*   [ONLY FOR ADMINS]
*/
router.delete('/:id', 
  verify.admin, //route accessible only by admins
  challengeController._delete_checks,
  challengeController.deleteChallenge
);

module.exports = router;
