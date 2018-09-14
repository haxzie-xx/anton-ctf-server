const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbStrings = require('../utils/dbStrings');

const TeamSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: dbStrings.collection.USER,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: dbStrings.collection.USER,
    }],
    finished: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: dbStrings.collection.USER,
        },
        challenge: {
            type: Schema.Types.ObjectId,
            ref: dbStrings.collection.CHALLENGE,
        },
        fat: {
            type: Date,
            default: Date.now,
        }
    }],
});

module.exports = mongoose.model(dbStrings.collection.TEAM, TeamSchema);