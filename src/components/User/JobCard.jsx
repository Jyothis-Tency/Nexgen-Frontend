"use client";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { WhatsApp } from "@mui/icons-material";
import { MdPlace } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoBriefcase } from "react-icons/io5";
import { calculateTimeAgo } from "@/utils/dateFormation";
import { IoMdTime } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";

const JobCard = ({ job, layout }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.seekerInfo);

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token && !!user?.userId; // Returns true if token exists and user is loaded
  };

  const jobDetailNavigation = () => {
    navigate(`/job-details/${job._id}`);
  };

  console.log("Job Card Props", job.employer);

  const handleApplyJob = (job) => {
    if (!isUserLoggedIn()) {
      // User is not logged in, store job ID and redirect to login
      localStorage.setItem("pendingJobId", job._id);
      toast.info("Please login to apply for this job");
      navigate("/login");
      return;
    }

    // User is logged in, proceed with job application
    navigate(`/job-application/${job._id}`, {
      state: {
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: job?.employerId,
      },
    });
  };

  console.log("Job Card Rendered", job);

  return (
    // <article
    //   className={`bg-white shadow-md rounded-2xl transition-all hover:shadow-lg
    //      w-full max-w-sm mx-auto p-5`}
    //   aria-label="Job listing card"
    // >
    //   {/* Logo Section */}
    //   <figure
    //     className={` w-14 h-14 mb-3 
    //   bg-black rounded-full flex items-center justify-center flex-shrink-0`}
    //     aria-hidden="true"
    //   >
    //     <span className="text-white font-bold text-lg">
    //       {job?.companyName?.charAt(0) || "J"}
    //     </span>
    //   </figure>

    //   {/* Job Info */}
    //   <div className={``}>
    //     <h1 className="text-lg font-semibold text-gray-800">{job?.jobTitle}</h1>
    //     {/* <p className="text-sm text-gray-500">{job.companyName.toUpperCase()}</p> */}

    //     {/* Job Details */}
    //     <div className="space-y-1">
    //       <div className="flex items-center space-x-2 text-gray-600 text-sm">
    //         <MdPlace className="flex-shrink-0" />
    //         <p className="truncate">{`${job?.city}, ${job?.country}`}</p>
    //       </div>

    //       <div className="flex items-center space-x-2 text-gray-600 text-sm">
    //         <FaIndianRupeeSign className="flex-shrink-0" />
    //         <p className="truncate">{job?.salaryRange?.join(" - ")}</p>
    //       </div>

    //       <div className="flex items-center space-x-2 text-gray-600 text-sm">
    //         <IoBriefcase className="flex-shrink-0" />
    //         <p className="truncate">
    //           {job?.experienceRequired[0]} -{" "}
    //           {job?.experienceRequired[job?.experienceRequired.length - 1]} yrs
    //         </p>
    //       </div>
    //     </div>
    //   </div>

    //   <footer
    //     className={`mt-1 w-full flex flex-col items-center sm:items-end gap-2`}
    //   >
    //     {/* Date in top-right */}
    //     <p className="text-xs sm:text-sm text-gray-500 self-end">
    //       {calculateTimeAgo(job?.createdAt)}
    //     </p>

    //     {/* Buttons centered below */}
    //     <div
    //       className={`w-full flex flex-col sm:flex-row items-center justify-center gap-2`}
    //     >
    //       {/* Apply / Applied Button */}
    //       <button
    //         className={`text-sm font-medium px-4 py-2 rounded-lg border transition w-full sm:w-auto
    //     ${
    //       job?.alreadyApplied
    //         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
    //         : "bg-green-500 text-white hover:bg-white hover:border-green-500 hover:text-green-500"
    //     }`}
    //         disabled={job?.alreadyApplied}
    //         aria-label={
    //           job?.alreadyApplied ? "Already applied" : "Apply to job"
    //         }
    //         onClick={
    //           !job.alreadyApplied ? () => handleApplyJob(job) : undefined
    //         }
    //       >
    //         {job?.alreadyApplied ? "Applied" : "Apply"}
    //       </button>

    //       {/* Job Details Button */}
    //       <button
    //         className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg 
    //     hover:bg-white border hover:border-blue-500 hover:text-blue-500 transition w-full sm:w-auto"
    //         aria-label="View job details"
    //         onClick={jobDetailNavigation}
    //       >
    //         Details
    //       </button>
    //       <a
    //         href={`https://wa.me/?text=${encodeURIComponent(
    //           `Check out this job: ${job?.jobTitle} at ${job?.employer?.name}. Here's the link: https://techpath.in/job-details/${job._id}`
    //         )}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
    //       >
    //         <WhatsApp
    //           style={{
    //             color: "#25D366",
    //             fontSize: 38,
    //             cursor: "pointer",
    //           }}
    //           titleAccess="Share on WhatsApp"
    //         />
    //         Share
    //       </a>
    //     </div>
    //   </footer>
    // </article>
    <article
    className="bg-white shadow-md rounded-2xl transition-all hover:shadow-lg w-full max-w-sm mx-2 overflow-hidden"
    aria-label="Job listing card"
  >
    {/* Header Section */}
    <div className="p-7 pb-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">{job?.jobTitle}</h1>
        <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Check out this job: ${job?.jobTitle} at ${job?.employer?.name}. Here's the link: https://techpath.in/job-details/${job._id}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            <button className="flex items-center gap-1 bg-blue-500 rounded-md text-white px-2.5 py-1">
            <span className="text-sm">Share</span>
              <IoMdShareAlt/>
            </button>
          </a>

      </div>

      {/* Location and Job Type Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-gray-600">
          <MdPlace className="text-red-500 flex-shrink-0" size={16} />
          <span className="text-sm font-medium">
            {job?.city}, {job?.country}
          </span>
        </div>
            
      </div>

      {/* Job Details Table */}
      <div className="space-y-3 mb-2">
        {/* <div className="flex justify-between items-center py-1">
          <span className="text-sm font-semibold text-gray-700">JOB ID</span>
          <span className="text-sm text-gray-600">{job?._id?.slice(-6) || "123456"}</span>
        </div> */}
{/* 
        <div className="flex justify-between items-center py-0">
          <span className="text-sm font-semibold text-gray-700">Comp. Type</span>
          <span className="text-sm text-gray-600">{job?.companyType || "Company"}</span>
        </div> */}

        <div className="flex justify-between items-center py-0">
          <span className="text-sm font-semibold text-gray-700">Salary</span>
          <div className="flex items-center space-x-1">
            <FaIndianRupeeSign className="text-gray-500" size={12} />
            <span className="text-sm text-gray-600">{job?.salaryRange?.join(" - ") || "Negotiable"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-0">
          <span className="text-sm font-semibold text-gray-700">Experience</span>
          <span className="text-sm text-gray-600">
            {job?.experienceRequired?.[0]} - {job?.experienceRequired?.[job?.experienceRequired.length - 1]} yrs
          </span>
        </div>
      </div>

      {/* Posted Date */}
      <div className="flex items-center space-x-2 text-gray-500 ">
        <IoMdTime className="text-red-500" size={16} />
        <span className="text-sm">Posted on {calculateTimeAgo(job?.createdAt)}</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="grid grid-cols-2 gap-0">
      <button
        className={`py-4 text-sm font-semibold transition-colors border-r-1 ${
          job?.alreadyApplied
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-slate-700 text-white hover:bg-slate-800"
        }`}
        disabled={job?.alreadyApplied}
        aria-label={job?.alreadyApplied ? "Already applied" : "Apply to job"}
        onClick={!job?.alreadyApplied ? () => handleApplyJob(job) : undefined}
      >
        {job?.alreadyApplied ? "APPLIED" : "APPLY NOW"}
      </button>

      <button
        className="bg-slate-700 text-white py-4 text-sm font-semibold hover:bg-slate-800 transition-colors"
        aria-label="View job details"
        onClick={jobDetailNavigation}
      >
        JOB DETAILS
      </button>
    </div>

    {/* WhatsApp Share - Mobile Only */}
    {/* <div className="p-3 border-t border-gray-100 sm:hidden">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `Check out this job: ${job?.jobTitle} at ${job?.employer?.name}. Here's the link: https://techpath.in/job-details/${job._id}`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center space-x-2 text-green-600 hover:text-green-700 transition-colors w-full py-2"
      >
        <FaWhatsapp size={20} />
        <span className="text-sm font-medium">Share on WhatsApp</span>
      </a>
    </div> */}
  </article>
  );
};

export default JobCard;
