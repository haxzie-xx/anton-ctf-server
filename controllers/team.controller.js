const Team = require('../models/team.model');
const { check, validationResult } = require('express-validator/check');

//==============================================================================
/**
 *  Controller to Get all the team details
 */
module.exports.getAllTeams = (req, res) => {

    Team.find({}).exec().then(docs => {
        
    })
}