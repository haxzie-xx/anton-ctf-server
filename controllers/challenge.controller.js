const Challenge = require('../models/challenge.model');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET || require('../utils/config').JWT_SECRET;

/* Controller to get all Challenges */
module.exports.getAllChallenge = function(req, res) {

    Challenge.find({}).then( docs => {
        res.status(200).json(docs);
    }).catch( err => {
        res.status(429).json({
            message: `Unable to find challenges`,
            error: err
        });
    });
}

//========================================================================================
/* Controller to get a single Challenge */
module.exports.getChallenge = function(req, res) {

    Challenge.findOne({_id: req.params.id}).then( doc => {
        res.status(200).json(doc);
    }).catch( err => {
        res.status(429).json({
            message: `Unable to find challenges`,
            error: err
        });
    });
}


//============================================================================================
/**
 * Controller to submit a flag
 * @param {*} req 
 * @param {*} res 
 */
module.exports._flag_checks = [
    check('challenge_id').exists(),
    check('flag').exists(),
];
module.exports.submitFlag = function(req, res) {
    
    //check if the token contains user id and team id
    const userId = req.decoded.id;
    const teamId = req.decoded.team;
    if ( !(userId) || !(teamId)) {
        // unauthenticated user
        return res.status(402).json({
            message: `Invalid token, missing id's and team data`
        });
    }

    Challenge.findOne({ _id: req.body.challenge_id }).exec()
    .then(doc => {

        doc.checkFlag(req.body.flag)
        .then(isValid => {
            if(!isValid) return res.status(402).json({ message: `Wrong flag`});

            //update user scores
            
            return res.status(200).json({
                message: `success`,
                points: doc.points
            });

        }).catch(err => {
            return res.status(402).json({
                message: `wrong flag`,
                error: err,
            });
        });
    }).catch(err => {
        return res.status(404).json({
            message: `No Matching challenge found`,
            error: err,
        });
    });

}

//====================================================================================

/**
 * Test the flag values
 * @param {*} req 
 * @param {*} res 
 */
module.exports.testFlag = function(req, res) {
    //check if the token contains user id and team id
    const userId = req.decoded.id;
    if ( !(userId)) {
        // unauthenticated user
        return res.status(402).json({
            message: `Invalid token, missing id's and team data`
        });
    }

    Challenge.findOne({ _id: req.body.challenge_id }).exec()
    .then(doc => {

        doc.checkFlag(req.body.flag)
        .then(isValid => {
            if(!isValid) return res.status(402).json({ message: `Wrong flag`});
            //Valid token            
            return res.status(200).json({
                message: `success`,
                points: doc.points
            });

        }).catch(err => {
            return res.status(402).json({
                message: `wrong flag`,
                error: err,
            });
        });
    }).catch(err => {
        return res.status(404).json({
            message: `No Matching challenge found`,
            error: err,
        });
    });
}


//====================================================================================
/**
 * Route to add new Challenge
 * ADMIN ONLY
 * @param {*} req 
 * @param {*} res 
 */
module.exports._challenge_checks = [
    check('name').exists().isLength({min: 10, max: 50}),
    check('description').exists().isLength({min: 10, max: 1000}),
    check('category').exists().isLength({min: 3, max: 15}),
    check('points').exists().isNumeric(),
    check('flag').exists()
];

module.exports.createChallenge = function(req, res) {
    //check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const userId = req.decoded.id;
    const challenge = new Challenge({
        name: req.body.name,
        creator: userId,
        description: req.body.description,
        category: req.body.category,
        flag: req.body.flag,
        points: req.body.points
    });

    challenge.save().then(doc => {
        return res.status(200).json({
            message: `Success`,
            doc: doc
        });
    }).catch(err => {
        return res.status(422).json({
            message: `DB error, unable to create challenge`,
            error: err
        });
    });
}

//================================================================================
/**
 * Controller to edit a single challenge
 */
module.exports._challenge_update_checks = [
    check('id').exists(),
    check('name').exists().isLength({min: 10, max: 50}),
    check('description').exists().isLength({min: 10, max: 1000}),
    check('category').exists().isLength({min: 3, max: 15}),
    check('points').exists().isNumeric(),
    check('flag').exists()
];
module.exports.editChallenge = function(req, res) {
    //check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const userId = req.decoded.id;
    const challenge = {
        name: req.body.name,
        creator: userId,
        description: req.body.description,
        category: req.body.category,
        flag: req.body.flag,
        points: req.body.points
    };

    Challenge.update({_id: req.params.id }, challenge, {upsert:false}).exec().then(doc => {
        return res.status(200).json({
            message: `Success`,
            doc: doc
        });
    }).catch(err => {
        return res.status(422).json({
            message: `DB error, unable to update challenge`,
            error: err
        });
    });
}

//===========================================================================
/**
 * Controller to delete a challenge
 */
module.exports._delete_checks = [
    check('id').exists(),
];
module.exports.deleteChallenge = (req, res) => {
    //check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    Challenge.remove({_id: req.params.id}).exec().then(doc => {
        return res.status(200).json({
            message: `Successfully deleted`,
        });
    }).catch(err => {
        return res.status(400).json({
            message: `Unable to delete`,
            error: err
        });
    });
}