const { User, Thought } = require('../models');

const resolvers = {
    Query: {
        // the first arguement is a placeholder, the second arguement is for parameters
        thoughts: async(parent, { username }) => {
            // if the username is passed in through the query, then we set our required params to the username, else we find all thoughts
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 })
        }
    }
};

module.exports = resolvers; 