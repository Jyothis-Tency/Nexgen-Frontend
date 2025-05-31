import { Routes, Route } from "react-router-dom";
import HomeLayout from "../pages/Employer/Layouts/HomeLayout";
import EmployerLogin from "../pages/Employer/EmployerLogin";
import Register from "../pages/Employer/Regitser";
import Profile from "../pages/Employer/Profile";
import Dashboard from "../pages/Employer/Outlets/Dashboard";
import CreateJob from "../pages/Employer/Outlets/CreateJob";
import JobList from "../pages/Employer/Outlets/JobList";
import Applicants from "../pages/Employer/Outlets/Applicants";
import CompanyDetails from "../pages/Employer/Outlets/CompanyDetails";
import EmployerCompleteProfile from "../pages/Employer/Outlets/CompleteProfile";
import RegisterOtp from "@/pages/Employer/OtpVerification";
import VerificationForm from "@/pages/Employer/Outlets/VerificationForm";
import NotFound from "@/pages/Employer/NotFound";
import AddorEditCompany from "@/pages/Employer/Outlets/AddorEditCompany";
import UpdateJob from "@/pages/Employer/Outlets/UpdateJob";
import { EmployerProtectedRoute } from "@/services/employerProtector";
import EmployerForgotPassword from "@/pages/Employer/ForgotPassword";
import EmployerForgotPasswordOtp from "@/pages/Employer/ForgotPasswordOTP";
import EmployerResetPassword from "@/pages/Employer/ResetPassword";

function Employer() {
  return (
    <Routes>
      <Route path="/employer-login" element={<EmployerLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/otp" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<EmployerForgotPassword />} />
      <Route
        path="/forgot-password-otp"
        element={<EmployerForgotPasswordOtp />}
      />
      <Route path="/reset-password" element={<EmployerResetPassword />} />
      <Route path="Verification" element={<VerificationForm />} />

      <Route
        path="/"
        element={
          <EmployerProtectedRoute>
            <HomeLayout />
          </EmployerProtectedRoute>
        }
      >
        <Route
          path="complete-profile"
          element={
            <EmployerProtectedRoute>
              <EmployerCompleteProfile />
            </EmployerProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <EmployerProtectedRoute>
              <Dashboard />
            </EmployerProtectedRoute>
          }
        />
        <Route
          path="create_job"
          element={
            <EmployerProtectedRoute>
              <CreateJob />
            </EmployerProtectedRoute>
          }
        />
        <Route path="job/edit" element={<UpdateJob />} />
        <Route
          path="job_list"
          element={
            <EmployerProtectedRoute>
              <JobList />
            </EmployerProtectedRoute>
          }
        />
        <Route
          path="applicants/:jobId"
          element={
            <EmployerProtectedRoute>
              <Applicants />
            </EmployerProtectedRoute>
          }
        />
        <Route
          path="company_details"
          element={
            <EmployerProtectedRoute>
              <CompanyDetails />
            </EmployerProtectedRoute>
          }
        />
        <Route
          path="addCompany"
          element={
            <EmployerProtectedRoute>
              <AddorEditCompany />
            </EmployerProtectedRoute>
          }
        />
        <Route
          path="addCompany/:companyId"
          element={
            <EmployerProtectedRoute>
              <AddorEditCompany />
            </EmployerProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default Employer;
