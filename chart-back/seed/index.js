const request = require('request-promise');
const User = require('../models/user.js');

const removeAllCollection = async () => {
    try {
        let user = await User.remove({});
        console.log('Remove User Collections');
    }catch (e) {
        console.error(e);
    }
    console.log('removeAllCollection');
};

const registrationUser = async () => {
    let options = {
        method: 'POST',
        uri: 'http://localhost:3000/registration',
        body: {
            username: 'cvaize',
            email: 'cvaize@gmail.com',
            password: '123HGhu1$%'
        },
        json: true // Automatically stringifies the body to JSON
    };
    let results = null;
    try {
        results = await request(options);
        console.log('registrationUser', results);
    }catch (e) {
        console.error(e);
    }
};

const init = () => {
    removeAllCollection().then(registrationUser);
};

exports.init = init;