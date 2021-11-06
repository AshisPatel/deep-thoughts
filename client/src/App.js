import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
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
// create an authentication path to valide whether or not a token exists on all API requests
// the _ allows us to set a placeholder for the first parameter, which we do not need access to (it holds the current request parameter) so that we can get to the second, which we do need. 
const authLink = setContext((_,{ headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});
// creates the connection to the API endpoint
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
              {/* We need to use nested routes here as optional paramteres are no longer supported in v6 */}
              <Route path="/profile">
                <Route path=":username" element={<Profile />} />
                <Route Path="" element={<Profile />} />
              </Route>
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
