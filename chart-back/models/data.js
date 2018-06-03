const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const pick = require('lodash/pick');
const langError = require('../lang/errors');

const dataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    type: {
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
    },
    value: {
        type: Number,
        required: langError["Specify the value to be stored."]
    },
    time: {
        type: mongoose.SchemaTypes.Date
    }
});

dataSchema.plugin(mongoosePaginate);

dataSchema.pre("save", function (next) {
    if(!this.time){ this.time = new Date(); }
    if (isNaN(Date.parse(this.time)) === true) {
        next({name: "ValidationError", errors: { data: {message: langError["Specify the correct time value."]} }});
    }
    this.time = new Date(this.time).toUTCString();
    next();
});

dataSchema.pre("update", function (next) {
    if(this._update['$set'].time){
        if (isNaN(Date.parse(this._update['$set'].time)) === true) {
            next({name: "ValidationError", errors: { data: {message: langError["Specify the correct time value."]} }});
        }
        this._update['$set'].time = new Date(this._update['$set'].time).toUTCString();
    }
    //TODO: Дописать валидацию value и проверку наличия type
    next();
});

dataSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return pick(json, ['id', 'value', 'time', 'type']);
};

module.exports = mongoose.model('Data', dataSchema);