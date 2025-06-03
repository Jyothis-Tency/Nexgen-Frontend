import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCardIcon from "@mui/icons-material/AddCard";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppMaybeTwoToneIcon from "@mui/icons-material/GppMaybeTwoTone";
import { useEffect, useRef, useState } from "react";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import EditProfileModal from "@/components/Employer/EditProfileModal";
import { updateEmployer } from "@/redux/actions/EmployerAction";
import CompanyProfile from "@/components/Employer/CompanyProfile";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyDetails() {
  const aboutRef = useRef(null);
  const jobsRef = useRef(null);
  const peopleRef = useRef(null);
  const lifeRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modalState, setModalState] = useState({
    editProfile: false,
    editCompany: false,
  });
  const [selectedComp, setSelectedComp] = useState(null);
  const employer = useSelector((state) => state.employer.employer);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const { data } = await employerAxiosInstance.get(
          `/job-list/${employer?.employerId}`
        );
        setJobs(data.jobPosts);
      } catch (error) {
        console.error("An error occurred while fetching jobs", error);
      }
    };
    fetchJobData();
  }, [employer?.employerId]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data } = await employerAxiosInstance.get(
          `/company-list/${employer?.employerId}`
        );
        setCompanies(data);
        console.log(data);
      } catch (error) {
        console.error("An error occurred in fetching company", error);
      }
    };
    fetchCompanyData();
  }, [employer?.employerId]);

  const openModal = (modalType) => {
    setModalState((prev) => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModalState((prev) => ({ ...prev, [modalType]: false }));
  };

  const handleSaveProfile = async (updatedEmp) => {
    try {
      const resultAction = await dispatch(updateEmployer(updatedEmp));
      if (updateEmployer.fulfilled.match(resultAction)) {
        console.log("Profile updated successfully:", resultAction.payload);
        closeModal("editProfile");
      } else {
        console.error("Profile update failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const sectionVariants = {
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
    hover: { scale: 1.2, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 0.8, y: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="overflow-hidden"
    >
      <Container maxWidth="lg" className="py-8">
        {/* Employer Section */}
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 mb-6 relative"
          variants={sectionVariants}
        >
          <Box className="flex relative items-center gap-4">
            <Box className="flex-1">
              <Box className="flex justify-between items-center pb-3">
                <Typography variant="h5" className="font-semibold">
                  Employer
                </Typography>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IconButton onClick={() => openModal("editProfile")}>
                    <EditIcon />
                  </IconButton>
                </motion.div>
              </Box>
              <Box className="flex-1 space-y-1">
                <Box className="flex gap-2 items-center">
                  <Typography variant="body1" className="text-gray-700">
                    {employer.name?.toUpperCase()}
                  </Typography>
                  {employer.isVerified ? (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <VerifiedUserIcon
                        sx={{
                          fontSize: 24,
                          color: "rgb(18, 171, 241)",
                          borderRadius: "50%",
                          padding: "4px",
                          boxShadow: "0 0 7px rgba(61, 184, 255, 0.8)",
                          transition: "0.3s ease-in-out",
                          "&:hover": {
                            boxShadow: "0 0 10px rgba(61, 184, 255, 1)",
                            transform: "scale(1.1)",
                          },
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to="/employer/verification">
                        <GppMaybeTwoToneIcon
                          sx={{
                            fontSize: 24,
                            color: "rgb(105, 105, 105)",
                            borderRadius: "50%",
                            padding: "4px",
                            boxShadow: "0 0 7px rgba(75, 81, 85, 0.8)",
                            transition: "0.3s ease-in-out",
                            "&:hover": {
                              boxShadow: "0 0 15px rgba(75, 81, 85, 1)",
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </Link>
                    </motion.div>
                  )}
                </Box>
                <Typography variant="body2" className="text-gray-500">
                  Email: {employer.email}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Phone: {employer.phone}
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Location: {employer.location}
                </Typography>
                {/* <Typography variant="body2" className="text-gray-700">
                  {employer.isBlocked ? "❌ Blocked" : "✅ Active"}
                </Typography> */}
                <Typography variant="body1" className="text-gray-700 pt-2">
                  {employer.about || ""}
                </Typography>
                <Stack direction="row" spacing={2} className="mt-3">
                  <AnimatePresence>
                    {employer.socialLinks?.linkedin && (
                      <motion.div
                        variants={buttonVariants}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Link
                          to={employer.socialLinks.linkedin}
                          className="text-blue-600"
                        >
                          LinkedIn
                        </Link>
                      </motion.div>
                    )}
                    {employer.socialLinks?.twitter && (
                      <motion.div
                        variants={buttonVariants}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Link
                          to={employer.socialLinks.twitter}
                          className="text-blue-600"
                        >
                          Twitter
                        </Link>
                      </motion.div>
                    )}
                    {employer.socialLinks?.facebook && (
                      <motion.div
                        variants={buttonVariants}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Link
                          to={employer.socialLinks.facebook}
                          className="text-blue-600"
                        >
                          Facebook
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Stack>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Company Section */}
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 mb-6 relative"
          variants={sectionVariants}
        >
          <Typography variant="h5" className="font-semibold">
            {companies.length > 0 ? "Company Details" : "Add Your Company"}
          </Typography>
          {companies.length > 0 ? (
            <CompanyProfile
              companies={companies}
              openModal={openModal}
              closeModal={closeModal}
              modalState={modalState}
              selectedComp={selectedComp}
              setSelectedComp={setSelectedComp}
            />
          ) : (
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Typography variant="body1" className="text-gray-500">
                You haven't added a company yet. Click below to add one.
              </Typography>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link to="/employer/addCompany">
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Add Company
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Jobs Section */}
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 mb-6"
          ref={jobsRef}
          variants={sectionVariants}
        >
          <Box className="flex justify-between items-center">
            <Typography variant="h5" className="font-semibold">
              Jobs
            </Typography>
            <Box className="relative inline-block group">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link to="/employer/create_job" className="text-blue-600 relative">
                  <IconButton>
                    <AddCardIcon />
                  </IconButton>
                  <motion.span
                    className="whitespace-nowrap min-w-max absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded"
                    variants={tooltipVariants}
                    initial="hidden"
                    whileHover="visible"
                  >
                    create new job post
                  </motion.span>
                </Link>
              </motion.div>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <AnimatePresence>
              {jobs.map((job, index) => (
                <Grid item xs={12} sm={6} key={job._id}>
                  <motion.div
                    className="border border-gray-200 rounded-lg p-4 shadow-md"
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Typography variant="h6" className="font-semibold">
                      {job.jobTitle}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {job.city} • Jobtype
                    </Typography>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </motion.div>

        {/* People Section */}
        {/* <Box className="bg-white shadow-lg rounded-lg p-6 mb-6" ref={peopleRef}>
          <Typography variant="h5" className="font-semibold">
            People
          </Typography>
          <Box className="flex mt-4">
            {[...Array(6)].map((_, i) => (
              <Avatar
                key={i}
                src="/src/assets/Candidate.png"
                className="w-10 h-10 -ml-4"
              />
            ))}
          </Box>
        </Box> */}

        {/* Life Section */}
        {/* <Box className="bg-white shadow-lg rounded-lg p-6" ref={lifeRef}>
          <Typography variant="h5" className="font-semibold">
            Life
          </Typography>
          <Grid container spacing={2} className="mt-4">
            <Grid item xs={12} sm={6}>
              <img
                src="/src/assets/companyLife.jpg"
                alt="Company life"
                className="rounded-lg w-full h-full object-cover"
                style={{ maxHeight: "300px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                {[1, 2, 3].map((_, i) => (
                  <Grid item xs={6} key={i}>
                    <img
                      src="/src/assets/companyLife.jpg"
                      alt={`Company life ${i}`}
                      className="rounded-lg w-full object-cover"
                      style={{ height: "100px" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box> */}

        <AnimatePresence>
          {modalState.editProfile && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <EditProfileModal
                employer={employer}
                open={modalState.editProfile}
                close={() => closeModal("editProfile")}
                onSave={handleSaveProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* {modalState.editCompany && (
          <EditCompanyModal
            company={selectedComp}
            open={modalState.editCompany}
            close={() => closeModal("editCompany")}
            onSave={handleSaveCompany}
          />
        )} */}
      </Container>
    </motion.div>
  );
}