const Challenge = require('../models/challenge.model');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET || require('../utils/config').JWT_SECRET;

module.exports.getAllChallenge = function(req, res) {

}

module.exports.submitFlag = function(req, res) {

}

module.exports.testFlag = function(req, res) {

}

module.exports.addChallenge = function(req, res) {
    
}