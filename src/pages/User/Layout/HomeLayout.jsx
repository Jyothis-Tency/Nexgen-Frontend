import React from 'react'
import Navbar from "@/components/User/Navbar";
import { Outlet } from 'react-router-dom';

function HomeLayout() {
  return (
    <div className="relative z-0 flex flex-col min-h-screen">
      <Navbar/>


      <Outlet />
    </div>
  )
}

export default HomeLayout
