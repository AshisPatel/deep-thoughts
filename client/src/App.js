import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

import Home from './pages/Home';

// create the link to the graphql server at it's endpoint in our server-side code
const httpLink = createHttpLink({
  uri: '/graphql'
});
// creates the connection to the API endpoint
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

function App() {
  return (
    // using ApolloProvider as a Context Provider to the rest of our App
    <ApolloProvider client={client}>
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <div className='container'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path ="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* the ? at the end of the parameter means that this parameter is optional */}
              <Route path="/profile/:username?" element={<Profile />} />
              <Route path="/thought/:id" element={<SingleThought />} />

              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
