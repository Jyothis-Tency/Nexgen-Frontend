import React from "react";
import { useNavigate } from "react-router-dom";
import { WhatsApp } from "@mui/icons-material";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from "../ui/card";

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage
// } from "../ui/avatar";

import { MdPlace } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoBriefcase } from "react-icons/io5";
import { calculateTimeAgo } from "@/utils/dateFormation";

const JobCard = ({ job, layout }) => {
  const navigate = useNavigate();

  const jobDetailNavigation = () => {
    navigate(`/job-details/${job._id}`);
  };
  console.log("Job Card Props", job.employer);
  const handleApplyJob = (job) => {
    navigate(`/job-application/${job._id}`, {
      state: {
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: job?.employerId
      }
    });
  };

  console.log("Job Card Rendered", job);
  

  return (
    <article
      className={`bg-white shadow-md rounded-2xl transition-all hover:shadow-lg
         w-full max-w-sm mx-auto p-5`}
      aria-label="Job listing card"
    >
      {/* Logo Section */}
      <figure
        className={` w-14 h-14 mb-3 
      bg-black rounded-full flex items-center justify-center flex-shrink-0`}
        aria-hidden="true"
      >
        <span className="text-white font-bold text-lg">
          {job?.companyName?.charAt(0) || "J"}
        </span>
      </figure>

      {/* Job Info */}
      <div className={``}>
        <h1 className="text-lg font-semibold text-gray-800">{job?.jobTitle}</h1>
        {/* <p className="text-sm text-gray-500">{job.companyName.toUpperCase()}</p> */}

        {/* Job Details */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <MdPlace className="flex-shrink-0" />
            <p className="truncate">{`${job?.city}, ${job?.country}`}</p>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <FaIndianRupeeSign className="flex-shrink-0" />
            <p className="truncate">{job?.salaryRange?.join(" - ")}</p>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <IoBriefcase className="flex-shrink-0" />
            <p className="truncate">
              {job?.experienceRequired[0]} -{" "}
              {job?.experienceRequired[job?.experienceRequired.length - 1]} yrs
            </p>
          </div>
        </div>
      </div>

      <footer
        className={`mt-1 w-full flex flex-col items-center sm:items-end gap-2`}
      >
        {/* Date in top-right */}
        <p className="text-xs sm:text-sm text-gray-500 self-end">
          {calculateTimeAgo(job?.createdAt)}
        </p>

        {/* Buttons centered below */}
        <div
          className={`w-full flex flex-col sm:flex-row items-center justify-center gap-2`}
        >
          {/* Apply / Applied Button */}
          <button
            className={`text-sm font-medium px-4 py-2 rounded-lg border transition w-full sm:w-auto
        ${
          job?.alreadyApplied
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-white hover:border-green-500 hover:text-green-500"
        }`}
            disabled={job?.alreadyApplied}
            aria-label={job?.alreadyApplied ? "Already applied" : "Apply to job"}
            onClick={
              !job.alreadyApplied ? () => handleApplyJob(job) : undefined
            }
          >
            {job?.alreadyApplied ? "Applied" : "Apply"}
          </button>

          {/* Job Details Button */}
          <button
            className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg 
        hover:bg-white border hover:border-blue-500 hover:text-blue-500 transition w-full sm:w-auto"
            aria-label="View job details"
            onClick={jobDetailNavigation}
          >
            Details
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Check out this job: ${job?.jobTitle} at ${job?.employer?.name}. Here's the link: https://techpath.in/job-details/${job._id}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
          >
            
            <WhatsApp
              style={{
                color: "#25D366",
                fontSize: 38,
                cursor: "pointer",
              }}
              titleAccess="Share on WhatsApp"
            />
            Share
          </a>
        </div>
      </footer>

      {/* Job Details Button and Posted Date */}
      {/* <footer
    className={`mt-4 ${layout === "list"
      ? "w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:ml-auto"
      : "flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0"
    }`}
  >
    <button
      className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg 
        hover:bg-white border hover:border-blue-500 hover:text-blue-500 transition w-full sm:w-auto"
      aria-label="View job details"
      onClick={jobDetailNavigation}
    >
      Job Details
    </button>

    <p className="text-xs sm:text-sm text-gray-500">{calculateTimeAgo(job.createdAt)}</p>
  </footer> */}
    </article>
  );
};

export default JobCard;
