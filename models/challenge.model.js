const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbStrings = require('../utils/dbStrings');

const ChallengeSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: true,
        max: 100,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: dbStrings.collection.USER,
    },
    description: {
        type: String,
        max: 1000,
        required: true,
    },
    category: {
        type: String,
        required: true,
        max: 100,
    },
    points: {
        type: Number,
        required: true,
    },
    flag: {
        type: String,
        max: 500,
        required: true,
    },
    finished: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: dbStrings.collection.USER,
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: dbStrings.collection.USER,
        },
        fat: {
            type: Date,
            default: Date.now,
        }
    }]
});

/**
 * Function to Validate given flag
 * @param {String} givenFlag 
 */
ChallengeSchema.methods.checkFlag = function(givenFlag) {
    return new Promise((resolve, reject) => {
        if (givenFlag && String(givenFlag).trim() === this.flag) {
            resolve(true);
        }else {
            reject(`Wrong flag`);
        }
    });
}

module.exports = mongoose.model(dbStrings.collection.CHALLENGE, ChallengeSchema);