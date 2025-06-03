import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import JobCard from "../../../components/User/JobCard";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { useSelector } from 'react-redux';
import { MdFilterList } from "react-icons/md";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AllJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchedJobs, setSearchedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const searchBoxRef = useRef(null);
  const location = useLocation();
  var { searchInput } = location.state || {};
  const user = useSelector((state) => state.user.seekerInfo);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);


  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowSearchBox(false);
      }
    }

    if (showSearchBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchBox]);

  useEffect(() => {
    if (searchInput) {
      setSearchTerm(searchInput);
      fetchJobs(searchInput); // ⬅️ This will fetch + search
      window.history.replaceState({}, document.title);
    } else {
      fetchJobs();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (showFilterModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }


    return () => document.body.classList.remove("overflow-hidden");
  }, [showFilterModal]);



  // useEffect(() => {
  //   filterJobs();
  // }, [jobType, experienceLevel, searchLocation]);
  const handleFilter = () => {
    filterJobs();
    setShowFilterModal(false)
  };

  const fetchJobs = async (searchInput = null) => {
    try {
      setLoading(true);
      const { data } = await userAxiosInstance.get("/getJobPosts", { params: { userId: user.userId } });
      if (data?.jobPosts) {
        setJobs(data.jobPosts);
        setFilteredJobs(data.jobPosts);
        console.log("RESULT", data.jobPosts)
      }
      setLoading(false);

      if (searchInput) {
        handleSearch(searchInput, data.jobPosts); // ⬅️ Pass jobs explicitly
      }
    } catch (error) {
      setLoading(false);
      toast.warning(error?.response?.data?.message || "An error occurred");
    }
  };

  const handleSearch = (inputTerm = null, jobsList = jobs) => {
    let term;

    // Check if called as an event handler
    if (inputTerm && inputTerm.target) {
      // Called from a button click or keypress — use current searchTerm state
      term = searchTerm.trim();
    } else if (typeof inputTerm === "string") {
      term = inputTerm.trim();
    } else {
      term = searchTerm.trim();
    }

    console.log("HANDLESEARCH TRIGGERED", searchTerm);
    console.log("HANDLESEARCH TRIGGERED", typeof inputTerm);
    if (term) {
      const searchedJobs = jobsList.filter((job) =>
        job.jobTitle.toLowerCase().includes(term.toLowerCase())
      );
      setSearchedJobs(searchedJobs);
      setFilteredJobs(searchedJobs);
      setShowSearchBox(false);
    }
  };

  const filterJobs = () => {
    if (searchTerm.length > 0) {
      var updatedJobs = [...searchedJobs];
      console.log("searched");
    } else {
      var updatedJobs = [...jobs];
      console.log("filter");
    }

    if (searchTerm) {
      updatedJobs = updatedJobs.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    console.log("searchTerm", updatedJobs);

    if (searchLocation) {
      updatedJobs = updatedJobs.filter((job) =>
        job.city.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    console.log("searchLocation", updatedJobs);

    if (jobType) {
      updatedJobs = updatedJobs.filter((job) => job.jobTitle === jobType);
    }
    console.log("jobType", updatedJobs);

    if (experienceLevel) {
      updatedJobs = updatedJobs.filter((job) =>
        job.experienceRequired.toString().includes(experienceLevel)
      );
    }

    setFilteredJobs(updatedJobs);
    setCurrentPage(1);
  };

  const clearAll = () => {
    if (searchTerm.length > 0) {
      setFilteredJobs(searchedJobs);
    } else {
      setFilteredJobs(jobs);
    }
    setSearchLocation("");
    setJobType("");
    setExperienceLevel("");
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
    setFilteredJobs(jobs);
  };




  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-100 min-h-screen py-10"
    >
      <div className="container mx-auto px-2 pt-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row gap-3"
        >
          {/* Filters Section */}
          {!isMobile && (
            <motion.div
              variants={itemVariants}
              className="w-full md:w-1/4 bg-white p-4 rounded-md shadow-md"
            >
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                {/* Location Filter */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-1">
                    Location
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  >
                    <option value="">Select Location</option>
                    {Array.from(new Set(jobs.map((job) => job.city))).map(
                      (city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      )
                    )}
                  </select>
                </motion.div>

                {/* Job Type Filter */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-1">
                    Job Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <option value="">Select Job Type</option>
                    {Array.from(new Set(jobs.map((job) => job.jobTitle))).map(
                      (type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </motion.div>

                {/* Experience Level Filter */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 font-medium mb-1">
                    Experience Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="">Select Experience</option>
                    {Array.from(
                      new Set(jobs.flatMap((job) => job.experienceRequired))
                    )
                      .sort((a, b) => a - b)
                      .map((level) => (
                        <option key={level} value={level}>
                          {level} years
                        </option>
                      ))}
                  </select>
                </motion.div>

                {/* Filter Button */}
                <div className="flex gap-2 items-center">
                  <motion.button
                    variants={itemVariants}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-center"
                    onClick={handleFilter}
                  >
                    Filter
                  </motion.button>

                  <motion.button
                    variants={itemVariants}
                    className="w-10 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                    onClick={clearAll}
                  >
                    <RxCross2 className="text-white text-lg" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search Section */}
          <motion.div variants={itemVariants} className="w-full">
            <div className="flex flex-row gap-3">
              <div className="w-full md:w-3/4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                  <input
                    type="text"
                    className="flex-grow min-w-0 px-4 py-2 focus:outline-none text-sm"
                    placeholder="Search job title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-3 min-w-[50px] h-full hover:bg-blue-700 transition"
                    title="Search"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>



              {/* filter button */}
              <motion.div
                variants={itemVariants}
                className="w-1/4 relative flex justify-end mb-6"
              >
                {/* Filter Button - hidden on desktop, shown on mobile */}
                {isMobile && (
                  <button
                    className="py-1 px-3 flex items-center gap-1 rounded-lg border border-blue-600 text-blue-600 md:hidden"
                    onClick={() => setShowFilterModal(true)}
                  >
                    Filter <MdFilterList />
                  </button>
                )}


              </motion.div>
            </div>

            {/* Job Listings */}
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center h-40"
              >
                <p className="text-gray-600 text-lg">Loading jobs...</p>
              </motion.div>
            ) : currentJobs.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`gap-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
                >
                  {currentJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      variants={itemVariants}
                      className="flex justify-center"
                    >
                      <JobCard job={job} layout={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination Controls */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-center mt-6"
                >
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    {"<"}
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1
                        ? "bg-primary text-white"
                        : "bg-gray-300"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 mx-1 bg-primary text-white rounded disabled:opacity-50"
                  >
                    {">"}
                  </button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center h-40"
              >
                <h1 className="text-xl md:text-2xl font-bold text-gray-700">
                  No jobs available
                </h1>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
      {isMobile && showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-11/12 max-w-md p-4 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilterModal(false)}>
                <RxCross2 className="text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Location
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {Array.from(new Set(jobs.map((job) => job.city))).map(
                    (city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    )
                  )}
                </select>
              </motion.div>

              {/* Job Type Filter */}
              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Job Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">Select Job Type</option>
                  {Array.from(new Set(jobs.map((job) => job.jobTitle))).map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </motion.div>

              {/* Experience Level Filter */}
              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Experience Level
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">Select Experience</option>
                  {Array.from(
                    new Set(jobs.flatMap((job) => job.experienceRequired))
                  )
                    .sort((a, b) => a - b)
                    .map((level) => (
                      <option key={level} value={level}>
                        {level} years
                      </option>
                    ))}
                </select>
              </motion.div>

              {/* Filter Button */}
              <div className="flex gap-2 items-center">
                <motion.button
                  variants={itemVariants}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-center"
                  onClick={handleFilter}
                >
                  Filter
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  className="w-10 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                  onClick={clearAll}
                >
                  <RxCross2 className="text-white text-lg" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default AllJobsPage;
