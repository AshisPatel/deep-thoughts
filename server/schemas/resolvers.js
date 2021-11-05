const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        // the first arguement is a placeholder, the second arguement is for parameters
        thoughts: async(parent, { username }) => {
            // if the username is passed in through the query, then we set our required params to the username, else we find all thoughts
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 })
        },
        // Find one thought by its id
        thought: async(parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts')
        },
        // get a user by username
        user: async(parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts')
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            return user; 
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');            
            }

            return user; 
        }
    }
};

module.exports = resolvers; 