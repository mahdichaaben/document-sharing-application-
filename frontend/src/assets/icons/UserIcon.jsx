// src/components/UserIcon.jsx
import React from 'react';
import userIcon from './user.png'; // Adjust the path according to your folder structure

const UserIcon = ({ className }) => {
  return (
    <img
      src={userIcon}
      alt="user icon"
      className={className} // Correctly apply the className prop
    />
  );
};

export default UserIcon;
