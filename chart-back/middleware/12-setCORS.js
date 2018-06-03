const langError = require('../lang/errors');

exports.init = app => app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Max-Age', 1728000);
    await next();
});
