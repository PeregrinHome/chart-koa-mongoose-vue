export const config = {
    host: 'http://localhost:3000',
    patterns: {
        // password: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/g,
        email: /^[-.\w]+@([\w-]+\.)+[\w-]{2,25}$/
    }
};