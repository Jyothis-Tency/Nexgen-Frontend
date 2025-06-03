import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, Slider, Chip } from "@mui/material";
import { Country, State, City } from "country-state-city";
import { useFormik } from "formik";
import { jobData } from "@/data/Job_titles";
import validateJobForm from "@/Validations/CreateJob-validation";
import { employerJobCreation, employerJobUpdate } from "@/apiServices/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBuilding } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function CreateJobForm({ selectedData = null, page = "create" }) {
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState(
    selectedData?.requirements || []
  );
  const [availableRequirements, setAvailableRequirements] = useState([]);

  const formik = useFormik({
    initialValues: {
      jobTitle: selectedData?.jobTitle || "",
      email: selectedData?.email || "",
      phone: selectedData?.phone || "",
      countryCode: "+91",
      country: "IN",
      salaryFrom: selectedData?.salaryRange[0] || 0,
      salaryTo: selectedData?.salaryRange[1] || 0,
      state: selectedData?.state || null,
      city: selectedData?.city || null,
      experienceRequired: [
        selectedData?.experienceRequired[0],
        selectedData?.experienceRequired[
          selectedData?.experienceRequired.length - 1
        ],
      ] || [0, 3],
      description: selectedData?.description || "",
      requirements: selectedData?.requirements || [],
    },
    validationSchema: validateJobForm,
    onSubmit: async (values) => {
      try {
        console.log(values);
        var status = null;
        if (page === "create") {
          status = await employerJobCreation(values, Employer?.employerId);
        } else if (page === "update") {
          values._id = selectedData?._id;
          status = await employerJobUpdate(values, Employer?.employerId);
        }
        if (status) {
          toast.success("Job created successfully");
          navigate("/employer/job_list");
          return;
        }
        toast.error(status?.message || "Error creating job post");
      } catch (error) {
        console.error("Job creation error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unexpected error occurred";
        toast.error(`Error: ${errorMessage}`);
      }
    },
  });

  useEffect(() => {
    if (formik.values.jobTitle) {
      const jobRequirements =
        jobData.jobs.find((job) => job.title === formik.values.jobTitle)
          ?.requirements || [];
      setAvailableRequirements(jobRequirements);
    }
  }, [formik.values.jobTitle]);

  useEffect(() => {
    if (formik.values.country) {
      const allStates = State.getStatesOfCountry(formik.values.country);
      setStates(allStates);
    } else {
      setStates([]);
    }
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.state && formik.values.country) {
      const allCities = City.getCitiesOfState(
        formik.values.country,
        formik.values.state
      );
      setCities(allCities);
    } else {
      setCities([]);
    }
  }, [formik.values.state, formik.values.country]);

  const handleJobTitleChange = (event, newValue) => {
    const jobTitle = newValue?.title || "";
    formik.setFieldValue("jobTitle", jobTitle);

    if (newValue) {
      const jobRequirements =
        jobData.jobs.find((job) => job.title === newValue.title)
          ?.requirements || [];
      setAvailableRequirements(jobRequirements);
      setSelectedRequirements([]);
    } else {
      setAvailableRequirements([]);
      setSelectedRequirements([]);
    }
  };

  const handleRequirementToggle = (requirement) => {
    const newRequirements = selectedRequirements.includes(requirement)
      ? selectedRequirements.filter((r) => r !== requirement)
      : [...selectedRequirements, requirement];

    setSelectedRequirements(newRequirements);
    console.log(
      "Selected requirements at handleToggle requirements: ",
      newRequirements
    );
    formik.setFieldValue("requirements", newRequirements);
  };

  // Find the selected job object
  const selectedJob =
    jobData.jobs.find((job) => job.title === formik.values.jobTitle) || null;

  // Find the selected state object
  const selectedState =
    states.find((state) => state.isoCode === formik.values.state) || null;

  // Find the selected city object
  const selectedCity =
    cities.find((city) => city.name === formik.values.city) || null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const chipVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
    selected: { scale: 1.05, backgroundColor: "#1976d2", color: "#fff" },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      <motion.div className="space-y-2" variants={itemVariants}>
        <div className="flex items-center gap-2">
          <FaBuilding className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {Employer.name.toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-bold">Create Job</h1>
      </motion.div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <motion.div className="space-y-4" variants={containerVariants}>
          <motion.h2
            className="text-xl font-semibold"
            variants={itemVariants}
          >
            Job Information
          </motion.h2>

          {/* Job Title Dropdown */}
          <motion.div className="w-full" variants={itemVariants}>
            <Autocomplete
              options={jobData.jobs}
              getOptionLabel={(option) => option.title}
              value={selectedJob}
              onChange={handleJobTitleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Job Title"
                  variant="outlined"
                  fullWidth
                  error={
                    formik.touched.jobTitle && Boolean(formik.errors.jobTitle)
                  }
                  helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                />
              )}
            />
            <AnimatePresence>
              {formik.touched.jobTitle && formik.errors.jobTitle && (
                <motion.div
                  className="text-red-600 text-sm mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {formik.errors.jobTitle}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Requirements Selection */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">
              Select Requirements
            </label>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {availableRequirements.map((requirement) => (
                  <motion.div
                    key={requirement}
                    variants={chipVariants}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Chip
                      label={requirement}
                      onClick={() => handleRequirementToggle(requirement)}
                      color={
                        selectedRequirements.includes(requirement)
                          ? "primary"
                          : "default"
                      }
                      className="cursor-pointer"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {formik.touched.requirements &&
                formik.errors.requirements &&
                selectedRequirements.length === 0 && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.requirements}
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Information */}
          <motion.div className="grid gap-4 sm:grid-cols-2" variants={itemVariants}>
            <div>
              <TextField
                fullWidth
                label="Contact Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <AnimatePresence>
                {formik.touched.email && formik.errors.email && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div className="flex gap-2 w-full md:w-3/4" variants={itemVariants}>
            <TextField
              sx={{ width: 80 }}
              label="Country Code"
              value={formik.values.countryCode}
              InputProps={{
                readOnly: true,
                style: {
                  pointerEvents: "none",
                },
              }}
            />
            <div className="flex-1">
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                type="tel"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
              <AnimatePresence>
                {formik.touched.phone && formik.errors.phone && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.phone}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Location Selection */}
          <motion.div className="grid gap-4 sm:grid-cols-3" variants={itemVariants}>
            <TextField
              fullWidth
              label="Country"
              value="India"
              InputProps={{
                readOnly: true,
                style: {
                  pointerEvents: "none",
                },
              }}
            />
            <div>
              <Autocomplete
                options={states}
                getOptionLabel={(option) => option.name}
                value={selectedState}
                disabled={!formik.values.country}
                onChange={(event, newValue) => {
                  formik.setFieldValue(
                    "state",
                    newValue ? newValue.isoCode : null
                  );
                  formik.setFieldValue("city", null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                )}
              />
              <AnimatePresence>
                {formik.touched.state && formik.errors.state && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.state}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.name}
                value={selectedCity}
                disabled={!formik.values.state}
                onChange={(event, newValue) => {
                  formik.setFieldValue("city", newValue ? newValue.name : null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                )}
              />
              <AnimatePresence>
                {formik.touched.city && formik.errors.city && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.city}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Salary Range */}
          <motion.div className="flex gap-5" variants={itemVariants}>
            <div className="flex-1">
              <TextField
                fullWidth
                label="Salary From"
                name="salaryFrom"
                type="number"
                value={formik.values.salaryFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.salaryFrom && Boolean(formik.errors.salaryFrom)
                }
                helperText={formik.touched.salaryFrom && formik.errors.salaryFrom}
                InputProps={{
                  startAdornment: <span className="text-gray-500 mr-1">₹</span>,
                }}
              />
              <AnimatePresence>
                {formik.touched.salaryFrom && formik.errors.salaryFrom && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.salaryFrom}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex-1">
              <TextField
                fullWidth
                label="Salary To"
                name="salaryTo"
                type="number"
                value={formik.values.salaryTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.salaryTo && Boolean(formik.errors.salaryTo)
                }
                helperText={formik.touched.salaryTo && formik.errors.salaryTo}
                InputProps={{
                  startAdornment: <span className="text-gray-500 mr-1">₹</span>,
                }}
              />
              <AnimatePresence>
                {formik.touched.salaryTo && formik.errors.salaryTo && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.salaryTo}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Experience Required */}
          <motion.div className="w-full max-w-md" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Required
            </label>
            <Box sx={{ px: 2 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Slider
                  value={formik.values.experienceRequired}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("experienceRequired", newValue);
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  marks
                />
              </motion.div>
              <div className="text-sm text-gray-600">
                {formik.values.experienceRequired[0]} -{" "}
                {formik.values.experienceRequired[1]}
                {formik.values.experienceRequired[1] === 10 ? "+" : ""} years
              </div>
            </Box>
          </motion.div>

          {/* Description */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description && Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
              <AnimatePresence>
                {formik.touched.description && formik.errors.description && (
                  <motion.div
                    className="text-red-600 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
}

export default CreateJobForm;