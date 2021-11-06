import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from "../utils/queries";

import ReactionList from '../components/ReactionList';

const SingleThought = props => {

  // the :id parameter is passed in from the Route for SingleThought and thus, we grab it from the useParams hook
  // we re-assign the id to the thoughtId?
  const { id: thoughtId } = useParams();
  
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // variable needs to match the query variable that is used
    variables: { id: thoughtId }
  });

  const thought = data?.thought || {};

  if(loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </div>
  );
};

export default SingleThought;
