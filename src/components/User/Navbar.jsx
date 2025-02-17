import React from "react";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search, Home, Work, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";

// const Navbar = () => {
//   const navigate = useNavigate();

import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for the mobile menu toggle
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { toast } from "sonner";

const Navbar = () => {
  const user = useSelector((state) => state.user.seekerInfo);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await userAxiosInstance.post("/logout");
      console.log('logout response',response)
      if (response.status === 200) {
        dispatch(logout());
        toast.success("Logout!!");
        navigate('/login')
      }
    } catch (err) {
      console.error('error',err)
      toast.error("Failed to login")
    }
  };

  return (
    <nav className="fixed bg-white z-50 w-full px-3 md:px-10 lg:px-20 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section: Logo */}
        <div
          className="text-2xl md:text-3xl lg:text-5xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          Nexgen
        </div>

        {/* Hamburger Icon for Mobile */}
        <div
          className="md:hidden text-primary cursor-pointer"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        {/* Right Section: Navigation Links (Desktop) */}
        <div className="hidden md:flex lg:gap-4 space-x-6 text-sm md:text-base lg:text-lg font-bold">
          <div
            className="flex items-center space-x-1 cursor-pointer text-primary hover:text-blue-300"
            onClick={() => navigate("/")}
          >
            <span>Home</span>
          </div>
          <div
            className="flex items-center space-x-1 cursor-pointer text-primary hover:text-blue-300"
            onClick={() => navigate("/all-jobs")}
          >
            <span>Browse Jobs</span>
          </div>
          <div
            className="flex items-center space-x-1 cursor-pointer text-primary hover:text-blue-300"
            onClick={() =>
              navigate(
                user && Object.keys(user).length > 0 ? "/profile" : "/login"
              )
            }
          >
            {Object.keys(user).length > 0 ? (
              <span>Profile</span>
            ) : (
              <span>Login/Sign Up</span>
            )}
          </div>
          {Object.keys(user).length > 0 && (
            <div
              className="flex items-center space-x-1 cursor-pointer text-primary hover:text-blue-300"
              onClick={handleLogout}
            >
              Logout
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 flex flex-col bg-black bg-opacity-80 text-white rounded-lg p-4 space-y-3 text-base font-bold">
          <div
            className="cursor-pointer hover:text-blue-300"
            onClick={() => {
              toggleMobileMenu();
              navigate("/");
            }}
          >
            Home
          </div>
          <div
            className="cursor-pointer hover:text-blue-300"
            onClick={() => {
              toggleMobileMenu();
              navigate("/jobs");
            }}
          >
            Browse Jobs
          </div>
          <div
            className="cursor-pointer hover:text-blue-300"
            onClick={() => {
              toggleMobileMenu();
              navigate(
                user && Object.keys(user).length > 0 ? "/profile" : "/login"
              );
            }}
          >
            {Object.keys(user).length > 0 ? "Profile" : "Login/Sign Up"}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
