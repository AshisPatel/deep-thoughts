const jwt = require('jsonwebtoken');

// Ask about this in office hours?
require("dotenv").config();
const secret= process.env.SECRET;
// console.log(secret);

const expiration = "2h";

module.exports = {
    // this function expects an object with the user's username, email and _id
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };
        // the signed token will create the jwt
        return jwt.sign({ data: payload }, secret , { expiresIn: expiration });
    },

    authMiddleware: function({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // seperate the "bearer" wrapper from the token value
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }
        // if no token present in request, return request without modification
        if (!token) {
            return req; 
        }

        // try catch is used so that errors on now thrown every time there is an invalid token, instead its just the console logged message
        try {
            // decode and attach user data to request object - this data is the payload that the token originally received upon being signed
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data; 
        } catch {
            console.log('Invalid token');
        }

        // return updated req data, with or without the user data based on the token
        return req; 
    }
};