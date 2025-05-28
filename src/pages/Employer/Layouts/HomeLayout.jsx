import React, { useState } from "react";
import Header from "../../../components/Employer/Header";
import { useNavigate, Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="relative bg-[#f7f6f9] h-full min-h-screen font-[sans-serif]">
      <div className="flex items-start">
        <section className="main-content w-full lg:px-10 ">
          <Header />
          <div className="lg:ml-[250px]">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeLayout;
