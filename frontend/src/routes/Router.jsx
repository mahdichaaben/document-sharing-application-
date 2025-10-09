import { createBrowserRouter } from "react-router-dom";
import HomeSpace from "@layouts/HomeSpace.jsx";
import AuthSpace from "@layouts/AuthSpace.jsx";
import Login from "@views/auth/Login.jsx";
import Register from "@views/auth/Register.jsx";
import LandingPage from "@views/Home/LandingPage.jsx";
import Settings from "@views/Home/Settings.jsx";
import Profile from "@views/Home/Profile";
import AllUsers from "@views/Home/AllUsers";
import AdminSpace from "@layouts/AdminSpace";
import Test from "@views/Test";

import DocPage from "@views/DocPage";
import TestCrudFile from "@views/TestCrudFile";
import Globtest from "@views/GlobTest";

import SharedFolders from "@views/Home/SharedFolders";

import  TestCrudFolderPrev from "@views/TestCrudFolderPrev"
const router = createBrowserRouter([

  {

    path: "/",
    element: < HomeSpace/>, 
    children:[
      {
        path: "/",
        element: <LandingPage/>, 
      },

      {
        path:"test",
        element:<Test/>
      },

      {
        path: "profile",
        element: <Profile/>, 
      },


      {
        path: "settings",
        element: <Settings/>, 
      },

      {
        path: "doc",
        element: <DocPage/>, 
      },


      {
        path: "crudfile",
        element: <TestCrudFile/>, 
      },


      {
        path: "crudfolder",
        element: <DocPage/>, 
      },



      {
        path: "globtest",
        element: < TestCrudFolderPrev />, 
      },


      {
        path: "shared",
        element: < SharedFolders/>, 
      },



      



     





    ]

   
  },


  {
    path: "/auth",
    element: < AuthSpace />, 
    children: [
      {
        path: "login", 
        element: <Login/>, 
      },
      {
        path: "register", 
        element: <Register/>, 
      },
    ],
  },


  {
    path: "/admin",
    element: < AdminSpace />, 
    children: [
      {
        path: "users", 
        element: <AllUsers/>, 
      }
    ],
  },



]);

export default router;
