import React, { useEffect, useState } from "react";
import { CiShare2, CiBookmarkCheck } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import Navbar from "../../../components/User/Navbar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { WhatsApp } from "@mui/icons-material";

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

const JobDetails = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.user.seekerInfo);
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userAxiosInstance.get(`/job-details/${id}`, {
          params: { userId: user.userId },
        });
        setJob(data.jobDetails);
        setCompany(data.employerDetails);
        console.log(data);
      } catch (error) {
        toast.warning(error.response.data.message || "An error occurred");
        navigate("/home");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleApplyJob = () => {
    navigate(`/job-application/${id}`, {
      state: {
        jobTitle: job?.name,
        companyName: company?.name,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`,
        employerId: company?.employerId,
      },
    });
  };

  if (!job || !company) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center min-h-screen"
      >
        Loading...
      </motion.div>
    );
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check out this job: ${job.name} at ${company.name}. Here's the link: ${currentUrl}`
  )}`;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col min-h-screen mt-16"
    >
      {/* <header className="flex-shrink-0">
        <Navbar />
      </header> */}

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full px-4 py-6 lg:px-14 flex flex-col lg:flex-row flex-grow gap-4 lg:gap-8"
      >
        <section className="w-full space-y-6">
          {/* Job Details Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md p-6 w-full"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="font-bold text-2xl lg:text-3xl">{job.name}</h1>
                <div className="space-y-1">
                  <motion.p variants={itemVariants} className="text-sm">
                    Company:{" "}
                    <span className="font-semibold">{company.name}</span>
                  </motion.p>
                  <motion.p variants={itemVariants} className="text-sm">
                    Location:{" "}
                    <span className="font-semibold">
                      {job.city}, {job.state}
                    </span>
                  </motion.p>
                  <motion.p variants={itemVariants} className="text-sm">
                    Email: <span className="font-semibold">{job.email}</span>
                  </motion.p>
                  <motion.p variants={itemVariants} className="text-sm">
                    Phone:{" "}
                    <span className="font-semibold">
                      {job.countryCode} {job.phone}
                    </span>
                  </motion.p>
                  <motion.p variants={itemVariants} className="text-sm">
                    Salary:{" "}
                    <span className="font-semibold">
                      {job.salary[0] === 0 && job.salary[1] === 0
                        ? "Not Provided"
                        : `₹${job.salary[0]} - ₹${job.salary[1]}`}
                    </span>
                  </motion.p>
                  <motion.p variants={itemVariants} className="text-sm">
                    Experience:{" "}
                    <span className="font-semibold">
                      {job.experience[0]}-{job.experience[1]} years
                    </span>
                  </motion.p>
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <button
                  className={`px-4 py-2 text-white rounded-md text-center text-sm font-semibold font-sans transition-colors ${
                    job.applied
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark"
                  }`}
                  onClick={!job.applied ? handleApplyJob : null}
                  disabled={job.applied}
                >
                  {job.applied ? "Applied" : "Apply Now"}
                </button>
                
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsApp
                      style={{
                        color: "#25D366",
                        fontSize: 38,
                        cursor: "pointer",
                      }}
                      titleAccess="Share on WhatsApp"
                    />
                  </a>
              

                <div className="flex gap-4">
                  {/* <CiBookmarkCheck className="text-2xl text-gray-700 cursor-pointer hover:text-primary transition-colors" />
                  <CiShare2 className="text-2xl text-gray-700 cursor-pointer hover:text-primary transition-colors" /> */}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Job Description and Requirements */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <motion.h5
              variants={itemVariants}
              className="text-lg font-semibold text-gray-700"
            >
              Job Description
            </motion.h5>
            <motion.p
              variants={itemVariants}
              className="text-sm lg:text-base whitespace-pre-wrap break-words"
            >
              {job.description}
            </motion.p>

            <motion.h5
              variants={itemVariants}
              className="text-lg font-semibold text-gray-700 mt-6"
            >
              Requirements
            </motion.h5>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="list-disc pl-5 space-y-2"
            >
              {job.requirements.map((requirement, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="text-sm lg:text-base"
                >
                  {requirement}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Company Details */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <motion.h5
              variants={itemVariants}
              className="text-lg font-semibold text-gray-700"
            >
              Company Details
            </motion.h5>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm lg:text-base"
            >
              <div className="space-y-2">
                <motion.p variants={itemVariants}>
                  <span className="font-medium">Email:</span> {company.email}
                </motion.p>
                <motion.p variants={itemVariants}>
                  <span className="font-medium">Phone:</span> {company.phone}
                </motion.p>
                <motion.p variants={itemVariants}>
                  <span className="font-medium">Status:</span> {job.status}
                </motion.p>
              </div>
              <div className="space-y-2">
                <motion.p variants={itemVariants}>
                  <span className="font-medium">Posted:</span>{" "}
                  {new Date(job.postedAt).toLocaleDateString()}
                </motion.p>
                <motion.p variants={itemVariants}>
                  <span className="font-medium">Location:</span> {job.city},{" "}
                  {job.state}
                </motion.p>
                <motion.p variants={itemVariants}>
                  <span className="font-medium">Country:</span> {job.country}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </motion.main>
    </motion.div>
  );
};

export default JobDetails;
