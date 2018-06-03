const User = require('../models/user');
const config = require('config');
// const pick = require('lodash/pick');
const login = {}, registration = {}, home = {}, user = {};
const passport = require('passport');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для http
const jwtsecret = config.get('secret'); // ключ для подписи JWT
const langError = require('../lang/errors');
const langSuc = require('../lang/success');

//TODO: Реализовать сброс пароля по email

login.post = async function(ctx, next) {
    await passport.authenticate('local', function (err, user) {
        console.log('authenticate', user);
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: 'login', errorMessages: { login: langError["Email or password is not correct"]} };
        } else {
            ctx.body = { redirect: '/', successMessages: { login: langSuc["You have successfully logged"] }, user:user.toWeb(), token:user.getJWT() };
        }
    })(ctx, next);
};
login.get = async function(ctx, next) {
    await passport.authenticate('jwt', function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: 'login', errorMessages: { login: langError["Login failed, please log in."]} };
        } else {
            ctx.body = { user:user.toWeb(), token:user.getJWT() };
        }
    })(ctx, next);
};
registration.post = async function(ctx, next) {
    let user = await User.create(ctx.request.body);
    ctx.body = { redirect: 'login', successMessages: { registration: langSuc["Registration was successful!"] } };
};
home.get = async function(ctx, next) {
    await passport.authenticate('jwt', function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: 'login', errorMessages: { login: langError["Login failed, please log in."]} };
        } else {
            ctx.body = { user:user.toWeb(), token:user.getJWT() };
        }
    })(ctx, next);
};
user.delete = async function(ctx, next) {
    await passport.authenticate('jwt', function (err, user, message) {
        if (user === false) {
            ctx.statusCode = 401;
            ctx.body = { redirect: 'login', errorMessages: { login: langError["Login failed, please log in."]} };
        } else {
            user.deleted = true;
            user.save();
            ctx.body = { user: 'clear', redirect: 'login', message: { data: langSuc["The user is marked as deleted."] } };
        }
    })(ctx, next);
};

module.exports = {
    user,
    login,
    registration,
    home
};

