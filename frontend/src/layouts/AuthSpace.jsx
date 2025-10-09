import React from "react";
import { BrowserRouter , Routes, Route, Navigate, Outlet } from "react-router-dom";

// components
import Navbar from "@components/Navbars/Navbar";

export default function AuthSpace() {
  return (
   <>
      <Navbar />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
            <Outlet/>
        </section>
      </main>
      </>
  );
}
