const jwt = require('jsonwebtoken');

// Ask about this in office hours?
require("dotenv").config();
const secret="thisisasecret";

const expiration = "2h";

module.exports = {
    // this function expects an object with the user's username, email and _id
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };
        // the signed token will create the jwt
        return jwt.sign({ data: payload }, secret , { expiresIn: expiration });
    }
};