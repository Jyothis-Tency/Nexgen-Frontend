"use client";

import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/redux/slices/employer";
import NavbarEmp from "./NavbarEmp";
import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employerData = useSelector((state) => state.employer.employer);
  const [imageError, setImageError] = useState(false);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);

  console.log(employerData);

  const handleLogout = async () => {
    try {
      const response = await employerAxiosInstance.post("/logout");
      console.log("logout response", response);
      if (response.status === 200) {
        dispatch(logout());
        setIsDecisionDialogOpen(false);
        navigate("/employer/employer-login");
        toast.success("Logout!!");
      }
    } catch (err) {
      console.error("error", err);
      toast.error("Failed to logout");
    }
  };

  const handleHomeNavigation = () => {
    navigate("/");
  };
  const handleCompanyDetailNavigation = () => {
    navigate("/employer/company_details");
  };

  return (
    <header className="z-50 bg-[#f7f6f9] top-0 pt-4">
      <div className="flex flex-wrap items-center px-6 py-2 bg-white shadow-md min-h-[56px] rounded-md w-full relative tracking-wide">
        <div className="flex items-center flex-wrap gap-x-8 gap-y-4 w-full">
          <NavbarEmp />
          <div className="flex justify-center bg-transparent absolute z-5 top- left-16 sm:hidden">
            <Link
              to="/employer/dashboard"
              className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out"
            >
              <h1 className="text-2xl font-bold text-primary">Techpath</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center space-x-6">
              {/* Home Icon - Replaced notification bell */}
              <button
                onClick={handleHomeNavigation}
                className="p-2 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out"
                title="Go to Dashboard"
                aria-label="Navigate to dashboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 cursor-pointer fill-[#333] hover:fill-[#077bff]"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </button>

              <p
                onClick={() => {
                  setIsDecisionDialogOpen(true);
                }}
                className="text-sm font-bold text-blue-600 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out hidden sm:block"
              >
                Logout
              </p>

              {/* Profile Image */}
              {imageError ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9 rounded-full border-2 border-gray-300 cursor-pointer hidden sm:block"
                  viewBox="0 0 512 512"
                >
                  <path d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934z" />
                </svg>
              ) : (
                <img
                  src="https://readymadeui.com/team-1.webp"
                  alt="Profile picture"
                  className="w-9 h-9 rounded-full border-2 border-gray-300 cursor-pointer hidden sm:block"
                  onError={() => setImageError(true)}
                />
              )}

              <div className="flex items-center gap-4 py-1 pl-1 text-gray-800 hidden sm:block">
                {employerData?.name &&
                  employerData.name
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className="dropdown-menu relative flex items-center shrink-0 group block sm:hidden">
              
                <MdAccountCircle className="w-9 h-5 gray-300 cursor-pointer" />
              
              {/* <div className="flex items-center gap-4 py-1 pl-1 text-gray-800">
                {employerData?.name &&
                  employerData.name
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
              </div> */}
              <div className="dropdown-content hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute z-40 top-9 right-0 w-56">
                <div className="w-full">
                  {/* Home option in mobile dropdown */}
                  <button
                    onClick={handleCompanyDetailNavigation}
                    className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out w-full text-left"
                  >
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-3 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg> */}
                    <VscAccount className="w-5 h-4 mr-3 gray-300 " />
                    Profile
                  </button>
                  <hr className="my-2 -mx-2" />
                  <p
                    onClick={() => {
                      setIsDecisionDialogOpen(true);
                    }}
                    className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out sm:hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-3 fillCurrent"
                      viewBox="0 0 6 6"
                    >
                      <path
                        d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                        data-original="#000000"
                      />
                    </svg>
                    Logout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Logout Dialog */}
      {isDecisionDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-md md:w-[1000px] w-[350px] ">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout ?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDecisionDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLogout()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
