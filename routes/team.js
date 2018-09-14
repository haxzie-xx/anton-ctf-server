const router = require('express').Router();
const verify = require('../utils/verify');

//view all team details
router.get('/', verify.user);

//get details of a single team
router.get('/:id', verify.user);

//create a new team
//Verification as basic, user isn't part of any team yet
router.post('/create', verify.basic);

//add a new team member
//Verification as basic, user isn't part of any team yet
router.post('/:id/add', verify.basic);

//remove a member or leave from the team
router.delete('/:team_id/:user_id', verify.user);

//delete a team
router.delete('/:team', verify.admin);

module.exports = router;