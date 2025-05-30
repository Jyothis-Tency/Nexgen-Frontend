// import React from "react";
// import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
// import { Search, Home, Work, Person } from "@mui/icons-material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { logout } from "@/redux/slices/userSlice";

// // const Navbar = () => {
// //   const navigate = useNavigate();

// import { useState } from "react";
// import { Menu, X } from "lucide-react"; // Icons for the mobile menu toggle
// import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
// import { toast } from "sonner";

// const Navbar = () => {
//   const user = useSelector((state) => state.user.seekerInfo);

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const isHomePage = location.pathname === "/";

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await userAxiosInstance.post("/logout");
//       console.log("logout response", response);
//       if (response.status === 200) {
//         dispatch(logout());
//         toast.success("Logout!!");
//         navigate("/login");
//       }
//     } catch (err) {
//       console.error("error", err);
//       toast.error("Failed to login");
//     }
//   };

//   return (
//     <nav
//       className={`fixed z-50 w-full px-3 md:px-10 lg:px-20 py-4 ${
//         isHomePage ? "" : "bg-white"
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         {/* Left Section: Logo */}
//         <div
//           className={`text-2xl md:text-3xl lg:text-5xl font-semibold font-marcellus cursor-pointer ${
//             isHomePage ? "text-white" : "text-primary"
//           }`}
//           onClick={() => navigate("/")}
//         >
//           Techpath
//         </div>

//         {/* Hamburger Icon for Mobile */}
//         <div
//           className={`md:hidden cursor-pointer ${
//             isHomePage ? "text-white" : "text-primary"
//           }`}
//           onClick={toggleMobileMenu}
//         >
//           {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
//         </div>

//         {/* Right Section: Navigation Links (Desktop) */}
//         <div className="hidden md:flex lg:gap-4 space-x-6 text-xs md:text-sm lg:text-md font-medium">
//           <div
//             className={`flex items-center space-x-1 cursor-pointer ${
//               isHomePage
//                 ? "text-white hover:text-gray-300"
//                 : "text-primary hover:text-blue-300"
//             }`}
//             onClick={() => navigate("/")}
//           >
//             <span>Home</span>
//           </div>
//           <div
//             className={`flex items-center space-x-1 cursor-pointer ${
//               isHomePage
//                 ? "text-white hover:text-gray-300"
//                 : "text-primary hover:text-blue-300"
//             }`}
//             onClick={() => navigate("/all-jobs")}
//           >
//             <span>Browse Jobs</span>
//           </div>

//           {Object.keys(user).length > 0 && (
//             <div
//               className={`flex items-center space-x-1 cursor-pointer ${
//                 isHomePage
//                   ? "text-white hover:text-gray-300"
//                   : "text-primary hover:text-blue-300"
//               }`}
//               onClick={() => navigate("/job-application-history")}
//             >
//               My Jobs
//             </div>
//           )}

//           <div
//             className={`flex items-center space-x-1 cursor-pointer ${
//               isHomePage
//                 ? "text-white hover:text-gray-300"
//                 : "text-primary hover:text-blue-300"
//             }`}
//             onClick={() =>
//               navigate(
//                 user && Object.keys(user).length > 0 ? "/profile" : "/login"
//               )
//             }
//           >
//             {Object.keys(user).length > 0 ? (
//               <span>Profile</span>
//             ) : (
//               <span>Login/Sign Up</span>
//             )}
//           </div>
//           {Object.keys(user).length > 0 && (
//             <div
//               className={`flex items-center space-x-1 cursor-pointer ${
//                 isHomePage
//                   ? "text-white hover:text-gray-300"
//                   : "text-primary hover:text-blue-300"
//               }`}
//               onClick={handleLogout}
//             >
//               Logout
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden mt-2 flex flex-col bg-black bg-opacity-80 text-white rounded-lg p-4 space-y-3 text-base font-bold">
//           <div
//             className="cursor-pointer hover:text-blue-300"
//             onClick={() => {
//               toggleMobileMenu();
//               navigate("/");
//             }}
//           >
//             Home
//           </div>
//           <div
//             className="cursor-pointer hover:text-blue-300"
//             onClick={() => {
//               toggleMobileMenu();
//               navigate("/all-jobs");
//             }}
//           >
//             Browse Jobs
//           </div>
//           {Object.keys(user).length > 0 && (
//             <div
//               className="flex items-center space-x-1 cursor-pointer hover:text-blue-300"
//               onClick={() => navigate("/job-application-history")}
//             >
//               My Jobs
//             </div>
//           )}
//           <div
//             className="cursor-pointer hover:text-blue-300"
//             onClick={() => {
//               toggleMobileMenu();
//               navigate(
//                 user && Object.keys(user).length > 0 ? "/profile" : "/login"
//               );
//             }}
//           >
//             {Object.keys(user).length > 0 ? "Profile" : "Login/Sign Up"}
//           </div>
//           {Object.keys(user).length > 0 && (
//             <div
//               className="flex items-center space-x-1 cursor-pointer hover:text-blue-300"
//               onClick={handleLogout}
//             >
//               Logout
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import { Menu, X, Bell, Trash2 } from "lucide-react";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { toast } from "sonner";
import io from "socket.io-client";

const socket = io("http://localhost:5001", { autoConnect: false });

const Navbar = () => {
  const user = useSelector((state) => state.user.seekerInfo);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!user?.userId) return;

    try {
      const response = await userAxiosInstance.get(
        `/notifications/${user.userId}`
      );
      setNotifications(response.data.notifications || []);
      setNotificationCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    }
  };

  // Initial load and socket setup
  useEffect(() => {
    if (user?.userId) {
      fetchNotifications();
      socket.connect();
      socket.emit("register", user.userId);

      socket.on("notification", (data) => {
        toast.info(data.message || "New notification received!");
        fetchNotifications(); // Refresh notifications when new one arrives
      });

      return () => {
        socket.off("notification");
        socket.disconnect();
      };
    }
  }, [user]);

  // Handle clicks outside the notification tab
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await userAxiosInstance.post("/logout");
      if (response.status === 200) {
        dispatch(logout());
        toast.success("Logged out successfully");
        socket.disconnect();
        setNotifications([]);
        setNotificationCount(0);
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    if (mobileMenuOpen) toggleMobileMenu();
  };

  const markAsRead = async (notificationId) => {
    try {
      await userAxiosInstance.patch(`/notifications/${notificationId}/read`);
      fetchNotifications(); // Refresh the notifications
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await userAxiosInstance.delete(`/notifications/${notificationId}`);
      fetchNotifications(); // Refresh the notifications
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  return (

    <nav
      className={`fixed z-50 w-full px-3 md:px-10 lg:px-20 py-4 ${
        isHomePage ? "" : "bg-white"
      }`}
    >

      <div className="flex items-center justify-between">
        {/* Left Section: Logo */}
        <div
          className={`text-2xl md:text-3xl lg:text-5xl font-semibold font-marcellus cursor-pointer ${
            isHomePage ? "text-white" : "text-primary"
          }`}
          onClick={() => navigate("/")}
        >
          Techpath
        </div>

        {/* Right Section: Hamburger and Notification Icon for Mobile */}
        <div className="flex items-center space-x-4">
          {Object.keys(user).length > 0 && (
            <div className="relative cursor-pointer md:hidden" ref={bellRef}>
              <Bell
                className={`${
                  isHomePage ? "text-white" : "text-primary"
                } h-6 w-6`}
                onClick={handleNotificationClick}
                aria-label="Open notifications"
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
          )}
          <div
            className={`md:hidden cursor-pointer ${
              isHomePage ? "text-white" : "text-primary"
            }`}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>

        {/* Right Section: Navigation Links (Desktop) */}
        <div className="hidden md:flex lg:gap-4 space-x-6 text-xs md:text-sm lg:text-md font-medium">
          <div
            className={`flex items-center space-x-1 cursor-pointer ${
              isHomePage
                ? "text-white hover:text-gray-300"
                : "text-primary hover:text-blue-300"
            }`}
            onClick={() => navigate("/")}
          >
            <span>Home</span>
          </div>
          <div
            className={`flex items-center space-x-1 cursor-pointer ${
              isHomePage
                ? "text-white hover:text-gray-300"
                : "text-primary hover:text-blue-300"
            }`}
            onClick={() => navigate("/all-jobs")}
          >
            <span>Browse Jobs</span>
          </div>

          {Object.keys(user).length > 0 && (
            <div
              className={`flex items-center space-x-1 cursor-pointer ${
                isHomePage
                  ? "text-white hover:text-gray-300"
                  : "text-primary hover:text-blue-300"
              }`}
              onClick={() => navigate("/job-application-history")}
            >
              <span>My Jobs</span>
            </div>
          )}

          <div
            className={`flex items-center space-x-1 cursor-pointer ${
              isHomePage
                ? "text-white hover:text-gray-300"
                : "text-primary hover:text-blue-300"
            }`}
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

          {/* Notification Icon (Desktop) */}
          {Object.keys(user).length > 0 && (
            <div
              className="relative flex items-center space-x-1 cursor-pointer"
              ref={bellRef}
            >
              <Bell
                className={`${
                  isHomePage ? "text-white" : "text-primary"
                } hover:text-blue-300 h-5 w-5`}
                onClick={handleNotificationClick}
                aria-label="Open notifications"
              />
              {(notificationCount > 0 || notificationCount == null) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
          )}

          {Object.keys(user).length > 0 && (
            <div
              className={`flex items-center space-x-1 cursor-pointer ${
                isHomePage
                  ? "text-white hover:text-gray-300"
                  : "text-primary hover:text-blue-300"
              }`}
              onClick={handleLogout}
            >
              <span>Logout</span>
            </div>
          )}
        </div>
      </div>

      {/* Notification Tab */}
      {showNotifications && user?.userId && (
        <div
          ref={notificationRef}
          className="fixed z-50 mt-2 right-0 md:right-4 lg:right-20 w-full md:w-96 max-h-[70vh] bg-white shadow-2xl rounded-xl overflow-y-auto border border-gray-100"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close notifications"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-5">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex items-start p-4 mb-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer relative ${
                    notification.read ? "opacity-75" : "font-medium"
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      )}
                      <p className="text-sm text-gray-800">
                        {notification.message}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                    className="ml-3 text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`Delete notification: ${notification.message}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
              navigate("/all-jobs");
            }}
          >
            Browse Jobs
          </div>
          {Object.keys(user).length > 0 && (
            <div
              className="cursor-pointer hover:text-blue-300"
              onClick={() => {
                toggleMobileMenu();
                navigate("/job-application-history");
              }}
            >
              My Jobs
            </div>
          )}
          {/* Notification Item (Mobile Menu) */}
          {Object.keys(user).length > 0 && (
            <div
              className="relative flex items-center space-x-2 cursor-pointer hover:text-blue-300"
              onClick={() => {
                toggleMobileMenu();
                handleNotificationClick();
              }}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 left-4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
          )}
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
          {Object.keys(user).length > 0 && (
            <div
              className="cursor-pointer hover:text-blue-300"
              onClick={() => {
                toggleMobileMenu();
                handleLogout();
              }}
            >
              Logout
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
