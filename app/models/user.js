const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { cartItemSchema } = require('./cart_item');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: function () {
                return 'invalid email format';
            }
        }
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ],
    cartItems: [cartItemSchema],
    whislist: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        isPublic: {
            type: Boolean,
            // enum :[,'private'],
            default: true
        }
    }]
});

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(user.password, salt).then((hashedPassword) => {
                user.password = hashedPassword;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.generateToken = function () {
    let tokenData = {
        _id: this._id
    };

    let generateTokenInfo = {
        access: 'auth',
        token: jwt.sign(tokenData, 'supersecret')
    }

    this.tokens.push(generateTokenInfo);

    return this.save().then((user) => {
        return generateTokenInfo.token;
    })
}

userSchema.methods.toJSON = function () {
    return _.pick(this, ['_id', 'username', 'email', 'role']);
}

userSchema.statics.findByToken = function (token) {
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'supersecret');
    } catch (e) {
        return Promise.reject(e);
    }

    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token
    });
}

userSchema.methods.deleteToken = function(userToken) {
    let findToken =  this.tokens.find((token) => {
       return token.token == userToken;
     })
     this.tokens.remove(findToken._id);
     return this.save();
   }

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}