// import the gql tagged template function 
const { gql } = require('apollo-server-express');



// create our typeDefs - this is a tagged template function , an ES6 feature
// Here we are defining a query using type Query { ... } inside this is the types of our queries and what data we expect them to return
// We can also define custom types, like we have done for the Thought type. ID counts as a unique string
// The ! mark means that the provided parameter MUST exist for GraphQL to carry out the query
const typeDefs = gql`
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        users: [User]
        user(username: String!) : User
        thoughts(username: String): [Thought]
        thought(_id:ID!): Thought
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addThought(thoughtText: String!): Thought
        addReaction(thoughtId: ID!, reactionBody: String!): Thought
        addFriend(friendId: ID!): User
    }

    
`;

module.exports = typeDefs; 