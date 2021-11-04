// import the gql tagged template function 
const { gql } = require('apollo-server-express');



// create our typeDefs - this is a tagged template function , an ES6 feature
// Here we are defining a query using type Query { ... } inside this is the types of our queries and what data we expect them to return
// We can also define custom types, like we have done for the Thought type. ID counts as a unique string
const typeDefs = gql`
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
    }

    type Query {
        thoughts: [Thought]
    }
`;

module.exports = typeDefs; 