import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/redux/slices/employer";
import NavbarEmp from "./NavbarEmp";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employerData = useSelector((state) => state.employer.employer);
  const [imageError, setImageError] = useState(false);

  console.log(employerData);
  const handleLogout = async () => {
    try {
      const response = await employerAxiosInstance.post("/logout");
      console.log("logout response", response);
      if (response.status === 200) {
        dispatch(logout());
        toast.success("Logout!!");
        navigate("/employer/employer-login");
      }
    } catch (err) {
      console.error("error", err);
      toast.error("Failed to logout");
    }
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 cursor-pointer fill-[#333] hover:fill-[#077bff]"
                viewBox="0 0 371.263 371.263"
              >
                <path
                  d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                  data-original="#000000"
                />
              </svg>
              <p
                onClick={handleLogout}
                className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out hidden sm:block"
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
              </p>
              {/* <div className="hidden sm:block"> */}
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
              {/* </div> */}
            </div>

            <div className="dropdown-menu relative flex shrink-0 group block sm:hidden">
              {imageError ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9 rounded-full border-2 border-gray-300 cursor-pointer"
                  viewBox="0 0 512 512"
                >
                  <path d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934z" />
                </svg>
              ) : (
                <img
                  src="https://readymadeui.com/team-1.webp"
                  alt="Profile picture"
                  className="w-9 h-9 rounded-full border-2 border-gray-300 cursor-pointer"
                  onError={() => setImageError(true)}
                />
              )}
              <div className="flex items-center gap-4 py-1 pl-1 text-gray-800">
                {employerData?.name &&
                  employerData.name
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>
              <div className="dropdown-content hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute top-9 right-0 w-56">
                <div className="w-full">
                  <hr className="my-2 -mx-2" />
                  <p
                    onClick={handleLogout}
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
    </header>
  );
};

export default Header;
