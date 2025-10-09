import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext'; // Import useAuth to access context

const Profile = () => {
  const { authUser } = useAuth(); // Destructure authUser from context
  const navigate = useNavigate();

  // If no authUser, navigate to login page
  useEffect(() => {
    if (!authUser) {
      // navigate('/auth/login'); // Uncomment to redirect to login if no user
    }
  }, [authUser, navigate]);

  // If authUser exists, render user information
  if (!authUser) {
    return <div>Loading...</div>; // Or redirect to a loading state
  }

  return (
    <div className="text-center mt-4">
      <p>Welcome, {authUser.name}!</p>
      <p>Email: {authUser.email}</p>
    </div>
  );
};

export default Profile;
