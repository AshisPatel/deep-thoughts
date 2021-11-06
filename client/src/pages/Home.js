import React from 'react';

import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';

import ThoughtList from '../components/ThoughtList';

const Home = () => {

  // use useQuery hook to make a query request
  // loading indicates whether or not the query has completed
  // data represents our retrieved information
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // use optional chaining to check to immediately access the data.thoughts object if it exists, else it the data does not exist it will be an empty array

  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {loading ? 
            <div>Loading...</div> 
            :
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..."/>
          }  
        </div>
      </div>
    </main>
  );
};

export default Home;
