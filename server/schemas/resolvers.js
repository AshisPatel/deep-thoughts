const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // query to get the current user via their jwt
        me: async (parent, args, context) => {
            // When the token gets accessed, we optain the request object as context
            // The context contains a .user object if the token was succesfully authenticated (context replaces request)
            // this .user data can then be accessed for the _id which is contained in the JWT's data. 
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends');

                return userData;
            }

            throw new AuthenticationError('Not logged in!');
        },
        // the first arguement is a placeholder, the second arguement is for parameters
        thoughts: async (parent, { username }) => {
            // if the username is passed in through the query, then we set our required params to the username, else we find all thoughts
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 })
        },
        // Find one thought by its id
        thought: async (parent, { _id }) => {
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
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts')
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            // create jwt once user creates account
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // sign jwt on proper account created
            const token = signToken(user);
            return { user, token };
        },
        addThought: async (parent, args, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );

                return thought;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addReaction: async (parent, args, context) => {
            const { thoughtId, reactionBody } = args;
            if (context.user) {
                const updatedThought = await Thought.findByIdAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    // addToSet is used to maintain unique inputs!
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;