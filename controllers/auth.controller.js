const User = require('../models/user.model');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET || require('../utils/config').JWT_SECRET;
const admin_secret = process.env.ADMIN_SECRET;

//==============================================================================
/* Validating signIn checks */
exports._auth_checks = [
    check('email').isEmail().exists(),
    check('password').isLength({min: 6}).exists()
];
exports.getAuth = function (req, res) {
    //check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    User.findOne({ email: req.body.email, admin: true }).then( user => {
        // if the document is empty
        if(!user) throw new Error('No accounts found');

        // compare the password
        user.comparePassword(req.body.password).then( isMatch => {
            if (!isMatch) {
                throw new Error("No users found");
            }
            // sign a json web token
            let token = jwt.sign( { id: user._id, email: user.email, admin: true }, jwt_secret, {
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
exports._auth_create_checks = [
    check('email').isEmail().exists(),
    check('password').isLength({min: 6}).exists(),
    check('name').exists().isLength({min: 4}),
    check('key').exists().isLength({min: 5})
];
exports.createAuth = function (req, res) {
    //check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //check is the key matches the admin secret
    if (!req.body.key || req.body.key !== admin_secret) {
        return res.status(409).json({
            message: `Invalid admin key`
        });
    }


    const admin = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        admin: true,
    });

    admin.save().then(doc => {
        return res.status(200).json({
            message: 'Admin Account created successfully',
        });
    }).catch(err => {
        return res.status(409).json({
            message: 'Unable to create admin account',
            error: err,
        });
    });
}