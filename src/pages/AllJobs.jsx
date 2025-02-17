import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

import JobCard from "../components/User/JobCard";
import Navbar from "../components/User/Navbar";
import { toast } from "sonner";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";

const AllJobsPage = () => {
  const mockJobs = Array(8).fill({});
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const [jobs, setJobs] = useState([]);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userAxiosInstance.get("/getJobPosts");

        console.log("response",res);

        setJobs(res.data);
      } catch (error) {
        console.error("error",error);
        toast.warning(error?.response?.data?.message || "An error occured");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Navbar /> */}

      <div className="container mx-auto px-4 py-8 ">
        <div className="flex flex-col md:flex-row gap-8 mt-14">
          {/* Filters Section */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Location
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  <option value="New York">New York</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Boston">Boston</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Miami">Miami</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Job Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Experience Level
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">Select Experience Level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Cards Section */}
          <div className="w-full md:w-3/4">
            {/* Search Bar */}
            <div className="mb-6 flex gap-1">
              <div className="relative w-1/2">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                <input
                  type="text"
                  placeholder="Search jobs"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-1/2">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search place"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Job Cards */}
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job, index) => (
                  <JobCard key={index} />
                ))}
              </div>
            ) : (
              <div className="w-full md:h-full h-28 flex items-center justify-center">
                <h1 className="text-xl md:text-2xl font-bold">
                  No job available
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllJobsPage;
