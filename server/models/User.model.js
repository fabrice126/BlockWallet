import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: 100,
        unique: true,
        required: [true, 'You must type an email'],
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: [true, 'You must type a password']
    },
    coins: [{
        "currency": {
            type: String,
            required: [true, 'You must type a currency'],
            maxlength: 6,
            uppercase: true,
            trim: true,
        },
        "buyValue": {
            type: Number,
            default: 0,
            required: [true, 'You must type a buyValue'],
        },
        "currentValue": {
            type: Number,
            default: null
        },
        "quantity": {
            type: Number,
            default: 0,
            required: [true, 'You must type a quantity'],
        },
        "exchange": {
            type: String,
            default: "binance",
            enum: ["binance", "bittrex", "kucoin"],
            required: [true, 'You must type an exchange'],
        },
        "img": {
            type: String,
            default: null,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
        collection: 'user',
        timestamps: true
    });


// Saves the user's password hashed (plain text password storage is not good)
userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        bcrypt.hash(user.password, 10).then(function (hash) {
            user.password = hash;
            next();
        }, (err) => next(err));
    } else return next();
});

// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = function (pw, cb) {
    const user = this;
    bcrypt.compare(pw, user.password, function (err, isMatch) {
        if (err) {
            console.log("comparePassword ERROR");
            return cb(err, isMatch);
        }
        console.log("comparePassword OK");
        cb(null, isMatch);
    });
};
module.exports = mongoose.model('User', userSchema)