const mongoose = require('mongoose');
const pick = require('lodash/pick');
const langError = require('../lang/errors');

const typeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: langError["Enter a name for the data type."]
    },
    login: {
        type: String,
        required: langError["Specify the Login of the data type."],
        validate: [
            {
                validator: function checkLogin(value) {
                    return /^[a-zA-Z1-9]+$/.test(value);
                },
                msg: langError["The login must be only Latin letters."]
            }
        ]
    }
}, {
    timestamps: true
});

typeSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return pick(json, ['name', 'login']);
};

module.exports = mongoose.model('DataType', typeSchema);