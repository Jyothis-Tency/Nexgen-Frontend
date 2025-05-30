import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import JobCard from "@/components/Employer/JobCard";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import { ImBriefcase } from "react-icons/im";
import { employerJobDelete, employerJobStatusChange } from "@/apiServices/userApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

function JobList() {
  const employer = useSelector((state) => state.employer.employer);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (job) => {
    if (job) {
      console.log("jobedit", job);
      navigate("/employer/job/edit", { state: { job } });
    }
  };

  const handleDelete = (job) => {
    if (job) {
      console.log("job delete", job);
      setSelectedJob(job);
      setIsDialogOpen(true);
    }
  };

  const handleStatus = async (job) => {
    if (job) {
      try {
        console.log("jobedit", job);
        const data = {
          status: job?.status === "open" ? "close" : "open",
        };
        const response = await employerJobStatusChange(job._id, data);
        if (response) {
          const updatedJob = response.data.updatedJob;
          setJobs((prevJobs) =>
            prevJobs.map((j) => (j._id === updatedJob._id ? updatedJob : j))
          );
          toast.success(`Status updated to ${data.status}.`);
          return;
        }
        toast.error(response?.message || "Error updating job status");
      } catch (error) {
        console.error("Job status update error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unexpected error occurred";
        toast.error(`Error: ${errorMessage}`);
      }
    }
  };

  const handleDeleteDecision = async () => {
    if (selectedJob) {
      try {
        console.log("job delete", selectedJob);
        const response = await employerJobDelete(selectedJob._id, employer?.employerId);
        if (response) {
          setJobs((prevJobs) =>
            prevJobs.filter((job) => job._id !== selectedJob._id)
          );
          toast.success(`Job deleted!`);
          return;
        }
        toast.error(response?.message || "Error deleting job");
      } catch (error) {
        console.error("Job deletion error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unexpected error occurred";
        toast.error(`Error: ${errorMessage}`);
      } finally {
        setIsDialogOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentViewMode("grid"); // Force "grid" on sm screens
      } else {
        setCurrentViewMode(viewMode); // Use actual viewMode above sm
      }
    };

    // Set mode on mount and listen for resizes
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await employerAxiosInstance.get(
          `/job-list/${employer?.employerId}`
        );
        console.log(res);
        setJobs(res.data.jobPosts);
        setLoading(false);
      } catch (error) {
        toast.warning(error?.response?.data?.message || "An error occurred");
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [employer?.employerId]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: i * 0.1 },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.div
        className="my-6 px-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <main className="container mx-auto px-8 py-8">
          <div className="mx-auto max-w-2xl space-y-8">
            <motion.div className="space-y-2" variants={itemVariants}>
              <div className="flex items-center gap-2">
                <ImBriefcase className="h-5 w-5 text-gray-400" />
                <h1 className="text-2xl font-bold">Job List</h1>
              </div>
            </motion.div>
            <motion.div
              className="hidden sm:flex justify-end mb-6"
              variants={itemVariants}
            >
              <motion.button
                className={`py-3 px-4 rounded-l-md ${
                  viewMode === "grid"
                    ? "bg-blue-600 border text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setViewMode("grid")}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaTh />
              </motion.button>
              <motion.button
                className={`py-3 px-4 rounded-r-md ${
                  viewMode === "list"
                    ? "bg-blue-600 border text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setViewMode("list")}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaList />
              </motion.button>
            </motion.div>

            {loading ? (
              <motion.div
                className="flex justify-center items-center h-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 text-lg">Loading jobs...</p>
              </motion.div>
            ) : jobs.length > 0 ? (
              <motion.div
                className={`gap-3 ${
                  currentViewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3"
                    : "flex flex-col"
                }`}
                variants={containerVariants}
              >
                <AnimatePresence>
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      className="flex justify-center"
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <JobCard
                        job={job}
                        layout={viewMode}
                        handleEdit={handleEdit}
                        handleStatus={handleStatus}
                        handleDelete={handleDelete}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                className="flex justify-center items-center h-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-xl md:text-2xl font-bold text-gray-700">
                  No jobs available
                </h1>
              </motion.div>
            )}
          </div>
        </main>
      </motion.div>

      {/* Status confirmation modal */}
      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="md:w-[1000px] w-[350px] rounded-md">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p>
                    Are you sure you want to delete this job application? This
                    action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <motion.button
                      onClick={() => setIsDialogOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleDeleteDecision}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

export default JobList;