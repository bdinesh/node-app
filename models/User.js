const mongoose = require('mongoose');
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [ validator.isEmail, 'Invalid email address' ],
        required: 'Please enter email address'
    },
    name: {
        type: String,
        trim: true,
        required: 'Please enter a name'
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    favoriteStores: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Store'
        }
    ]
});

userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);

    return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);