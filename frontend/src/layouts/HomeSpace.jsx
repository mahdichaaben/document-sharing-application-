import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { CollapsedContext } from '@context/CollapsedContext'; // Adjust the path as necessary

import Navbar from "@components/Navbars/Navbar";
import FooterSmall from "@components/Footers/Footer";
import Login from "@views/auth/Login.jsx";
import Register from "@views/auth/Register";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function HomeSpace() {

  return (
    <>
      <main>
        <Navbar />
        <section className="relative w-full h-full min-h-screen">
          <Outlet />
        </section>
      </main>
    </>
  );
}
