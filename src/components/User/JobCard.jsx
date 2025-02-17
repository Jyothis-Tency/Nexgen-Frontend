import React from "react";
import { MdPlace } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
// import moment from "moment/moment";
const JobCard = ({title  ,location , salary , date , id }) => {
  const navigate = useNavigate()
  const jobDetailNavigation = () => {
    navigate(`/job-details/${id}`)
  }
  return (
    <article className="w-80   mx-auto bg-white shadow-md rounded-lg p-6 space-y-4" aria-label="Job listing card for UI/UX Designer">
      {/* Header Section */}
      <header className="flex items-center space-x-4">
        <figure className="w-12 h-12 bg-black rounded-full flex items-center justify-center" aria-hidden="true">
          {/* Placeholder for the logo */}
          <span className="text-white font-bold text-lg">F</span>
        </figure>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">Frmer</p>
        </div>
      </header>

      {/* Job Details Section */}
      <section className="space-y-2" aria-labelledby="job-details-heading">
        <h2 id="job-details-heading" className="sr-only">
          Job Details
        </h2>
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <span className="material-icons" aria-hidden="true"><MdPlace /></span>
          <p>{location}</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <span className="material-icons" aria-hidden="true"><FaIndianRupeeSign /></span>
          <p>{salary?.join(' - ')}</p>
        </div>
       
      </section>

      {/* Tags Section */}
      

      {/* Footer Section */}
      <footer className="flex justify-between items-center text-sm text-gray-500">
        <time dateTime="2024-06-14">
        {/* {moment(date).format("MMM Do YY")}   */}
        </time>
        <button
          className="bg-primary text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
          aria-label="View job details for UI/UX Designer"
          onClick={jobDetailNavigation}
        >
          Job Details
        </button>
      </footer>
    </article>
  );
};

export default JobCard;
