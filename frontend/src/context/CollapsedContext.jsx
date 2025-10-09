import React, { createContext, useState } from "react";

export const CollapsedContext = createContext();

export const CollapsedProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <CollapsedContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </CollapsedContext.Provider>
  );
};
