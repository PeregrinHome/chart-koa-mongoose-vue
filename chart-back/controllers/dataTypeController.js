const dataTypes = {};
const passport = require('passport');
const User = require('../models/user');
const DataType = require('../models/dataType');
const Data = require('../models/data');
const config = require('config');
const langError = require('../lang/errors');
const langSuc = require('../lang/success');

dataTypes.get = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."] }};
        } else {
            let types = await DataType.find({ email: user.email });
            if(types.length !== 0){
                types = types.map(type => type.toWeb());
                ctx.body = { dataTypes: types, token: user.getJWT()};
            }else{
                ctx.body = { redirect: '/types/create', dataType: false, message: { dataType: langSuc["Data types have not been created yet!"] }, token: user.getJWT()};
            }
        }
    })(ctx, next);
};
dataTypes.put = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."] }};
        } else {
            let saveData = {};

            for (let key in ctx.request.body) {
                if (key === 'login' || key === 'name') {
                    saveData[key] = ctx.request.body[key];
                }
            }
            if(!!saveData.login && !!(await DataType.findOne({email: user.email, login: saveData.login}))
            ){
                ctx.statusCode = 400;
                ctx.body = { token: user.getJWT(), dataType: false, message: { dataType: langError["You have already created such a login."] } };
            }else{
                let type = await DataType.findOneAndUpdate({ email: user.email, login: ctx.params.login }, { $set: saveData}, { new: true });
                ctx.body = { token: user.getJWT(), type: type.toWeb() };
            }



        }
    })(ctx, next);
};
dataTypes.post = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."]}};
        } else {
            ctx.request.body.email = user.email;

            let check = await DataType.findOne({email: ctx.request.body.email, login: ctx.request.body.login});

            if(!check){
                let type = await DataType.create(ctx.request.body);
                ctx.body = { token:user.getJWT(), type: type.toWeb() };
            }else{
                ctx.statusCode = 400;
                ctx.body = { dataType: false, message: { dataType: langError["This data type login already exists"] }, token: user.getJWT()};
            }
        }
    })(ctx, next);
};
dataTypes.delete = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."]}};
        } else {
            ctx.request.body.email = user.email;

            let result = await DataType.remove({email: ctx.request.body.email, login: ctx.request.body.types});
            if(result.ok){
                await Data.remove({ email: user.email, type: ctx.request.body.types});
                ctx.body = { token: user.getJWT(), message: { dataType: langSuc["The removal was successful."] } };
            }else{
                ctx.statusCode = 400;
                ctx.body = { token: user.getJWT(), errorMessages: { dataType: langError["Deletion failed."] } };
            }
        }
    })(ctx, next);
};

module.exports = {
    dataTypes
};