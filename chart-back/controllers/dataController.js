const data = {};
const passport = require('passport');
const pick = require('lodash/pick');
const mongoose = require('mongoose');
const User = require('../models/user');
const DataType = require('../models/dataType');
const Data = require('../models/data');
const config = require('config');
const langError = require('../lang/errors');
const langSuc = require('../lang/success');

data.get = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."] }};
        } else {
            if(ctx.request.body.types && ctx.request.body.types.length > 0){
                let options = {
                    limit: 100,
                    offset: 0
                };

                if(ctx.request.body.limit){
                    if(isNaN(Number(ctx.request.body.limit)) === true || Number(ctx.request.body.offset) < 0){
                        ctx.statusCode = 400;
                        ctx.body = { data: false, errorMessages: { data: langError["For pagination, use only numbers with a value greater than 0."] }, token: user.getJWT()};
                        return;
                    }
                    options.limit = Number(ctx.request.body.limit);
                }

                if(ctx.request.body.offset){
                    if(isNaN(Number(ctx.request.body.offset)) === true || Number(ctx.request.body.offset) < 0){
                        ctx.statusCode = 400;
                        ctx.body = { data: false, errorMessages: { data: langError["For pagination, use only numbers with a value greater than 0."] }, token: user.getJWT()};
                        return;
                    }
                    options.limit = Number(ctx.request.body.offset);
                }

                let data = [];
                for(let i = 0; i < ctx.request.body.types.length; i++){
                    let check = await DataType.findOne({ login: ctx.request.body.types[i], email: user.email});
                    if(check){
                        let query = { type: check.login, email: user.email };
                        let startEnd = { time: {} };
                        if(ctx.request.body.start){
                            if (isNaN(Date.parse(ctx.request.body.start)) === true) {
                                ctx.statusCode = 400;
                                ctx.body = { data: false, errorMessages: { data: langError["Specify the correct time value."] }, token: user.getJWT()};
                                return;
                            }
                            startEnd.time.$gte = (new Date(ctx.request.body.start)).toUTCString();
                        }
                        if(ctx.request.body.end){
                            if (isNaN(Date.parse(ctx.request.body.end)) === true) {
                                ctx.statusCode = 400;
                                ctx.body = { data: false, errorMessages: { data: langError["Specify the correct time value."] }, token: user.getJWT()};
                                return;
                            }
                            startEnd.time.$lte = (new Date(ctx.request.body.end)).toUTCString();
                        }

                        if(startEnd.time.$gte || startEnd.time.$lte){
                            query = Object.assign(query, startEnd);
                        }
                        let predata = await Data.paginate(query, options);
                        predata.docs = predata.docs.map(v=>v.toWeb());
                        data = data.concat(predata.docs);
                    }else{
                        ctx.statusCode = 400;
                        ctx.body = { data: false, errorMessages: { data: langError["Specify the correct data types."] }, token: user.getJWT()};
                        return;
                    }
                }
                ctx.body = { data: data, token: user.getJWT() };
            }else{
                ctx.statusCode = 400;
                ctx.body = { data: false, errorMessages: { data: langError["Specify the data types."] }, token: user.getJWT() };
            }

        }
    })(ctx, next);
};
data.put = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."] }};
        } else {
            if(ctx.request.body.data && ctx.request.body.data.length > 0){
                //TODO: ВНИМАНИЕ: Дыра в безопасности, нет проверки на допустимость редактирования, на пренадлженость данных этому пользователю.
                //TODO: Сделать обновление массовым(при таком действии возможно придется переписать валидацию в модели) и дописать положительные ответы если это необходимо.
                for(let i = 0; i < ctx.request.body.data.length; i++){
                    if(ctx.request.body.data[i].id){
                        await Data.update({ _id: mongoose.Types.ObjectId(ctx.request.body.data[i].id) }, { $set: pick(ctx.request.body.data[i], ['value', 'time', 'type'])});
                    }
                }
            }
            ctx.body = { token: user.getJWT() };
        }
    })(ctx, next);
};
data.post = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."]}};
        } else {
            if(ctx.request.body.data){
                let save = [];
                for (let key in ctx.request.body.data){
                    let check = await DataType.findOne({ login: key, email: user.email});
                    if(check){
                        save = save.concat(ctx.request.body.data[key].map(v=>{
                            v.type = check.login;
                            v.email = check.email;
                            return v;
                        }));
                    }else{
                        ctx.statusCode = 400;
                        ctx.body = { data: false, errorMessages: { data: langError["Specify the correct data types to save the data."] }, token: user.getJWT()};
                        return;
                    }
                }
                let data = await Data.create(save);
                data = data.map(v => v.toWeb());

                ctx.body = { data: data, message: { data: langSuc["The data was successfully added."]}, token: user.getJWT()};
            }else{
                ctx.statusCode = 400;
                ctx.body = { data: false, errorMessages: { data: langError["Be sure to specify the data to save."] }, token: user.getJWT()};
            }
        }
    })(ctx, next);
};
data.delete = async function(ctx, next) {
    await passport.authenticate('jwt', async function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: '/login', errorMessages: { login: langError["Login failed, please log in."]}};
        } else {
            let result = true, resultDel;
            if(ctx.request.body.data && ctx.request.body.data.length > 0){
                ctx.request.body.data = ctx.request.body.data.map(v=>{
                    v = mongoose.Types.ObjectId(v);
                    return v;
                });
                resultDel = await Data.remove({ email: user.email, _id: ctx.request.body.data});
                if(!resultDel.ok){
                    result = false;
                }
            }
            if(ctx.request.body.types && ctx.request.body.types.length > 0){
                resultDel = await Data.remove({ email: user.email, type: ctx.request.body.types});
                if(!resultDel.ok){
                    result = false;
                }
            }
            if(result){
                ctx.body = { token: user.getJWT(), message: { data: langSuc["The removal was successful."] } };
            }else{
                ctx.statusCode = 400;
                ctx.body = { token: user.getJWT(), errorMessages: { data: langError["Deletion failed."] } };
            }
        }
    })(ctx, next);
};

module.exports = {
    data
};