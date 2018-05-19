const data = {};
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');
const DataType = require('../models/dataType');
const config = require('config');
const langError = require('../lang/errors');
const langSuc = require('../lang/success');

data.get = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."] }};
        } else {
            //TODO: Нужно сделать конструктор запросов для динамического добавления параметров запроса

            //TODO: Нужно добавить валидацию дополнительных параметров. Лучше всего разработать глобальный валидатор - обертку перед основным кодом.
            if(ctx.request.body.types && ctx.request.body.types.length > 0){
                let length = ctx.request.body.length || 100;

                let timeBorder = {};
                let startEnd = {};
                if(ctx.request.body.start){
                    startEnd.$gte = ctx.request.body.start;
                }
                if(ctx.request.body.end){
                    startEnd.$lt = ctx.request.body.end;
                }
                if(!!startEnd.$gte || !!startEnd.$lt){
                    timeBorder = {match: { time: startEnd}};
                }

                //TODO: Переделать схемы и модели, иначе фильтрация не сработает
                let types = await DataType.find({email: user.email, login: ctx.request.body.types});
                // let types = await DataType.find({email: user.email, login: ctx.request.body.types}).slice('data', length)
                //     .populate(
                //         {
                //             path: 'data',
                //             match: { time: {$gte: new Date(2018, 6, 7, 1, 10), $lte: new Date(2018, 8, 7, 1, 10)}}
                //         });
                // types = types.map(v => v.toWeb());
                // console.log(types);
                if(types.length !== 0){
                    ctx.body = { dataTypes: types, token: user.getJWT() };
                }else{
                    ctx.body = { dataTypes: false, message: { dataTypes: langSuc["Data types have not been created yet!"] }, token: user.getJWT() };
                }
            }else{
                ctx.body = { dataTypes: false, errorMessages: { dataTypes: langError["Specify the data types."] }, token: user.getJWT() };
            }

        }
    })(ctx, next);
};
data.put = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."] }};
        } else {
            // let saveData = {};
            //
            // for (let key in ctx.request.body) {
            //     if (key === 'login' || key === 'name') {
            //         saveData[key] = ctx.request.body[key];
            //     }
            // }
            // if(!!saveData.login &&
            //     !!(await DataType.findOne({email: user.email, login: saveData.login}))
            // ){
            //     ctx.body = { token: user.getJWT(), dataType: false, message: { dataType: langSuc["You have already created such a login."] } };
            // }else{
            //     let type = await DataType.findOneAndUpdate({ email: user.email, login: ctx.params.login }, { $set: saveData}, { new: true });
            //     ctx.body = { token: user.getJWT(), type: type.toWeb() };
            // }
            //

            ctx.body = { token: user.getJWT() };
        }
    })(ctx, next);
};
data.post = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."]}};
        } else {
            //TODO: Валидность времени и значения не проверяется. Проверяется только их наличие.
            if(ctx.request.body.data){
                for (let key in ctx.request.body.data){
                    await DataType.update(
                            {email: user.email, login: key},
                            { $push: { data: ctx.request.body.data[key] }
                        });
                }
                ctx.body = { token: user.getJWT() };
            }else{
                ctx.body = { dataTypes: false, errorMessages: { dataTypes: langError["Be sure to specify the data to save."] }, token: user.getJWT()};
            }
            ctx.body = { token: user.getJWT() };
        }
    })(ctx, next);
};
data.delete = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."]}};
        } else {
            // ctx.request.body.email = user.email;
            //
            // let result = await DataType.remove({email: ctx.request.body.email, login: { $in: ctx.request.body.types}});
            // if(result.ok){
            //     ctx.body = { token: user.getJWT(), message: { dataType: langSuc["The removal was successful."] } };
            // }else{
            //     ctx.body = { token: user.getJWT(), errorMessages: { dataType: langError["Deletion failed."] } };
            // }

            ctx.body = { token: user.getJWT() };
        }
    })(ctx, next);
};

module.exports = {
    data
};