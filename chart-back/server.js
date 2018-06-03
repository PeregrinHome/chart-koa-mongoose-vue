const config = require('config');
const {server, mongoose} = require('./app');

mongoose.connect(config.mongoose.uri);
server.listen(config.port);

// const seed = require('./seed/index');
//
// seed.init();