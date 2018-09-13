const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        max: 50,
    },
    admin: {
        type: Boolean,
        default: false
    },
    profile: {
        name: {
            type: String,
            max: 50,
        },
        phone: {
            type: String,
            max: 10,
        },
        gender: {
            type: String,
            max: 1,
        },
        college: {
            type: String,
            max: 100,
        },
        year: {
            type: Number,
        },
        branch: {
            type: String,
            max: 50,
        }
    }
});


/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    let user = this;
    console.log(user);
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash(user.password, salt, undefined, (err, hash) => {
        if (err) { return next(err); }
        user.password = hash;
        next();
      });
    });
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) {
                reject(err);
            }
            resolve(isMatch);
        });
    });
};

module.exports = mongoose.model('User', userSchema);