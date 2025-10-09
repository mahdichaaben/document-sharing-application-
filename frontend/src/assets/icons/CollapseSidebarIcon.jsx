// assets/icons/CollapseSidebarIcon.js

import React from 'react';
import collapseSidebarIcon from './collapse-sidebar.svg'; // Adjust the path if needed

const CollapseSidebarIcon = ({ className = '', alt = 'Collapse Sidebar' }) => {
  return (
    <img src={collapseSidebarIcon} alt={alt} className={`w-6 h-6 ${className}`} />
  );
};
export default CollapseSidebarIcon; 
