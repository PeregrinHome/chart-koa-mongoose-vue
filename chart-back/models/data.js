const mongoose = require('mongoose');
const pick = require('lodash/pick');
const langError = require('../lang/errors');

const dataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: langError["Specify the value to be stored."]
    },
    time: {
        type: mongoose.SchemaTypes.Date,
        required: true
    }
});

dataSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return pick(json, ['id', 'value', 'type', 'time']);
};

module.exports = mongoose.model('Data', dataSchema);