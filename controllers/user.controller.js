const User = require('../models/user.model');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET || 'buhahahahaha';

/* Validations for registrations */
exports._register_checks = [
    check('email').isEmail().exists(),
    check('password').isLength({min: 6}).exists(),
    check('name').isLength({min: 4}).exists(),
    check('phone').isMobilePhone().isLength({min: 10}).exists(),
    check('gender').isAlpha().exists(),
];
exports.register = function (req, res) {

    //check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const userData = req.body;
    const user = new User({
        email: userData.email,
        password: userData.password,
        profile: {
            name: userData.name,
            phone: userData.phone,
            gender: userData.gender,
        }
    });

    user.save().then(doc => {
        return res.status(200).json({
            message: `Success! Successfully registered`,
            id: doc._id
        });
    }).catch(err => {
        return res.status(409).json({
            message: `SignUp failed`,
            error: err
        });
    });    
} 


//============================================================================================

/* Validating signIn checks */
exports._signIn_checks = [
    check('email').isEmail().exists(),
    check('password').isLength({min: 6}).exists()
];
exports.signIn = function (req, res) {
    //check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    User.findOne({ email: req.body.email }).then( user => {
        // if the document is empty
        if(!user) throw new Error('No accounts found');

        // compare the password
        user.comparePassword(req.body.password).then( isMatch => {
            if (!isMatch) {
                throw new Error("No users found");
            }
            // sign a json web token
            let token = jwt.sign( { id: user._id, email: user.email }, jwt_secret, {
                expiresIn: 86400 // valid till 24 hours
            });

            return res.status(200).json({
                message: 'Successfully Signed In',
                token
            });
        }).catch( err => { // wrong password
            return res.status(403).json({
                message: 'Invalid Username or password'
            });
        });
    }).catch( err => { // no account found for the given details
        return res.status(402).json({
            message: 'No account found for the email'
        });
    });
}

//==========================================================================================