const express = require('express');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

const path = require('path');

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

// Server up static assets
// This will check to see if the node environment is in production mode and if it is, it will send assets from the build directory in the client directory (Created on development)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// This is a wildcard route that if any route is sent to the server that is not a DB / server recognized route, it will server assets from the react front end
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/index.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
