import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./../pages/Login";
import ForgotPassword from "./../pages/ForgotPassword";
import RegisterOtp from "./../pages/RegisterOtp";
import SignupPage from "./../pages/SignUp";
import Profile from "../pages/Profile";
import JobApplication from "../pages/JobApplication";
import Home from "../pages/Home";
import ApplicationSubmitted from "../pages/ApplicationSubmitted";
import Home2 from "../pages/Home2";
import AllJobsPage from "../pages/AllJobs";
import JobDetailPage from "../pages/JobDetails";
import ListingTable from "../components/common/table";
import Home3 from "@/pages/Home3";

const usersData = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    role: "Admin",
    isActive: true,
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    isActive: false,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Viewer",
    isActive: true,
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Admin",
    isActive: true,
  },
  {
    id: 5,
    name: "Evan Wright",
    email: "evan@example.com",
    role: "Editor",
    isActive: false,
  },
  {
    id: 6,
    name: "Fiona Green",
    email: "fiona@example.com",
    role: "Viewer",
    isActive: true,
  },
  {
    id: 7,
    name: "George Hill",
    email: "george@example.com",
    role: "Admin",
    isActive: false,
  },
  {
    id: 9,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 10,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 11,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 12,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 13,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 14,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 15,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 16,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
  {
    id: 17,
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Editor",
    isActive: true,
  },
];

const rows = 5; // Show 5 rows per page
const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  {
    key: "isActive",
    label: "Active",
    render: (value) => (value ? "Yes" : "No"),
  },
];

const handleEdit = (id) => {
  console.log("Edit user with id:", id);
};

const handleDelete = (id) => {
  console.log("Delete user with id:", id);
};

const handleToggleActive = (id) => {
  console.log("Toggle active status for user with id:", id);
};

function User() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home3 />} />
      <Route path="/home3" element={<Home3 />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp-verification" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/job-application/:id" element={<JobApplication />} />
      <Route path="/application-submitted" element={<ApplicationSubmitted />} />
      <Route path="/all-jobs" element={<AllJobsPage />} />
      <Route path="/job-details/:id" element={<JobDetailPage />} />
      <Route
        path="/table"
        element={
          <ListingTable
            users={usersData}
            columns={columns}
            rowsPerPage={rows}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        }
      />
    </Routes>
  );
}

export default User;
