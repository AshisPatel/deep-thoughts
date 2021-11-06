import React from 'react';

import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

const Home = () => {

  // use useQuery hook to make a query request
  // loading indicates whether or not the query has completed
  // data represents our retrieved information
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const { data: userData, loading: loadingFL } = useQuery(QUERY_ME_BASIC);

  const loggedIn = Auth.loggedIn();

  // use optional chaining to check to immediately access the data.thoughts object if it exists, else it the data does not exist it will be an empty array

  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? 
            <div>Loading...</div> 
            :
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..."/>
          }  
        </div>
        { (loggedIn && userData) && 
          <div className="col-12 col-lg-3 mb-3">
            {loadingFL ? 
                <div>Loading...</div> 
              :
                <FriendList
                username={userData.me.username}
                friendCount={userData.me.friendCount}
                friends={userData.me.friends}
              />
            }
          </div>
        }
      </div>
    </main>
  );
};

export default Home;
