const crypto = require('crypto');
const mongoose = require('mongoose');
const _ = require('lodash');
const config = require('config');
const beautifyUnique = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для http
const pick = require('lodash/pick');
const langError = require('../lang/errors');

const userSchema = new mongoose.Schema({
    username: {
        type:     String,
        required: langError["username empty"]
    },
    email: {
        type:     String,
        unique: langError["Two users cannot use the same Email."],
        required: langError["E-mail empty"],
        validate: [
            {
                validator: function checkEmail(value) {
                    return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
                },
                msg: langError["Please specify a valid email address."]
            }
        ]
    },
    deleted: {
        type: Boolean,
        default: false
    },
    passwordHash: {
        type: String,
        required: true
    },
    salt: {
        required: true,
        type: String
    }
}, {
    timestamps: true
});

userSchema.plugin(beautifyUnique);

userSchema.virtual('password')
    .set(function(password) {
        if (!config.auth.password.pattern.test(password)) {
            this.invalidate('password', langError["The password no current"]);
        }

        this._plainPassword = password;

        if (password) {
            this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(
                password,
                this.salt,
                config.crypto.hash.iterations,
                config.crypto.hash.length,
                'sha1'
            ).toString('base64');
        } else {
            // remove password (unable to login w/ password any more, but can use providers)
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function() {
        return this._plainPassword;
    });

userSchema.methods.getJWT = function(){
    let expiration_time = 10; // seconds
    return "Bearer "+jwt.sign({email:this.email}, config.get('secret'), {expiresIn: expiration_time});
};
userSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return pick(json, ['username', 'email']);
};

userSchema.methods.checkPassword = function(password) {
    if (!password) return false; // empty password means no login by password
    if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

    return crypto.pbkdf2Sync(
        password,
        this.salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha1'
    ).toString('base64') == this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);