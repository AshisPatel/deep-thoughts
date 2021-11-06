import React from 'react';
import { useParams , Navigate } from "react-router-dom";
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

const Profile = () => {

  const { username: userParam } = useParams();
  // if the user clicks on the "my profile" link in the navbar, the route will not have any username in it
  // This causes :username parameter to be blank, and thus we will instead use QUERY_ME instead of QUERY_USER
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME , {
    variables: { username: userParam }
  });

  // redirect to personal profile page if the user clicks on the profile link on a post that was made by them
  if(Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile"/>;
  }

  // Checks to see if we need to query info for the user logged in (me), another user, or be blank due to data not loaded yet. 
  const user = data?.me || data?.user || {};

  console.log(user);

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {user.username}'s profile'.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...'`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList friendCount={user.friendCount} username={user.username} friends={user.friends} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
