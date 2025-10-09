import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import Router from "./routes/Router";

// Context Providers
import { AuthProvider } from "@context/AuthContext";
import { CollapsedProvider } from "@context/CollapsedContext";

// Import axios config
import "./axiosConfig"; // Ensure axios is configured before use

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CollapsedProvider>
        <RouterProvider router={Router} />
      </CollapsedProvider>
    </AuthProvider>
  </React.StrictMode>
);
