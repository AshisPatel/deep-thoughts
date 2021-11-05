const express = require('express');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

// Initialize the apollo server
const startApolloServer = async () => {
  // Create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
      typeDefs,
      resolvers,
      // passing in context to pass headers for the JWT request in the me query
      // Grabs the request information and only returns the headers key
      context: authMiddleware
  });

  // Start the Apollo Server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

startApolloServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
