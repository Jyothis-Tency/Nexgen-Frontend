"use client";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, FileText, Trash2, Check, X, Award } from "lucide-react";
import userAxiosInstance from "../../../config/axiosConfig/userAxiosInstance";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { jobData } from "./../../../data/Job_titles";


// Validation schemas
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be between 10-15 digits")
    .required("Phone number is required"),
  about: Yup.string().max(500, "About must be less than 500 characters"),
  DOB: Yup.date().nullable(),
  location: Yup.string().max(100, "Location must be less than 100 characters"),
});

const EducationSchema = Yup.object().shape({
  qualification: Yup.string()
    .min(2, "Qualification must be at least 2 characters")
    .max(100, "Qualification must be less than 100 characters")
    .required("Qualification is required"),
  institute: Yup.string()
    .min(2, "Institute name must be at least 2 characters")
    .max(100, "Institute name must be less than 100 characters")
    .required("Institute name is required"),
  startYear: Yup.number()
    .min(1900, "Start year must be after 1900")
    .max(new Date().getFullYear(), "Start year cannot be in the future")
    .required("Start year is required"),
  endYear: Yup.number()
    .nullable()
    .min(
      Yup.ref("startYear"),
      "End year must be greater than or equal to start year"
    )
    .max(
      new Date().getFullYear() + 10,
      "End year cannot be too far in the future"
    ),
});

const ExperienceSchema = Yup.object().shape({
  jobTitle: Yup.string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .required("Job title is required"),
  company: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .required("Company name is required"),
  startYear: Yup.number()
    .min(1900, "Start year must be after 1900")
    .max(new Date().getFullYear(), "Start year cannot be in the future")
    .required("Start year is required"),
  endYear: Yup.number()
    .nullable()
    .min(
      Yup.ref("startYear"),
      "End year must be greater than or equal to start year"
    )
    .max(
      new Date().getFullYear() + 10,
      "End year cannot be too far in the future"
    ),
});

const SkillsSchema = Yup.object().shape({
  skillTitle: Yup.string().required("Job title is required"),
  requireMents: Yup.array()
    .min(1, "Please select at least one skill")
    .required("Skills are required"),
});

// Custom form input component with error handling
const FormInput = ({ label, name, type = "text", placeholder, ...props }) => (
  <div className="grid gap-2">
    <Label htmlFor={name}>{label}</Label>
    <Field name={name}>
      {({ field, meta }) => (
        <div>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            {...field}
            {...props}
            className={meta.touched && meta.error ? "border-destructive" : ""}
          />
          <ErrorMessage
            name={name}
            component="div"
            className="text-destructive text-xs mt-1"
          />
        </div>
      )}
    </Field>
  </div>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempUser, setTempUser] = useState(null);

  // File upload states
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [isImageConfirmationOpen, setIsImageConfirmationOpen] = useState(false);
  const [isResumeConfirmationOpen, setIsResumeConfirmationOpen] =
    useState(false);

  // Education and experience dialog states
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [educationIndex, setEducationIndex] = useState(null);
  const [experienceIndex, setExperienceIndex] = useState(null);

  // Skills dialog states
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [skillIndex, setSkillIndex] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState([]);

  const userId = useSelector((state) => state.user.seekerInfo.userId);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userAxiosInstance.get(`/user-profile/${userId}`);
      console.log("User data response:", response.data.userData);
      if (response.status === 200) {
        setUser(response.data.userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Profile image handling
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(previewUrl);
    setIsImageConfirmationOpen(true);
  };

  const confirmImageUpload = async () => {
    if (!selectedImageFile) return;

    const formData = new FormData();
    formData.append("profileImg", selectedImageFile);

    try {
      const response = await userAxiosInstance.post(
        `/update-profileImg/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Profile image updated successfully");
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to update profile image");
    } finally {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      setIsImageConfirmationOpen(false);
      setSelectedImageFile(null);
      setPreviewImageUrl(null);
    }
  };

  const cancelImageUpload = () => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setIsImageConfirmationOpen(false);
    setSelectedImageFile(null);
    setPreviewImageUrl(null);
  };

  // Resume handling
  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload only PDF files");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume size should be less than 10MB");
      return;
    }

    if (user?.resume && user.resume.length >= 5) {
      toast.error("Maximum 5 resumes allowed");
      return;
    }

    setSelectedResumeFile(file);
    setIsResumeConfirmationOpen(true);
  };

  const confirmResumeUpload = async () => {
    if (!selectedResumeFile) return;

    const formData = new FormData();
    formData.append("resume", selectedResumeFile);

    try {
      const response = await userAxiosInstance.post(
        `/update-resume/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Resume uploaded successfully");
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setIsResumeConfirmationOpen(false);
      setSelectedResumeFile(null);
    }
  };

  const handleRemoveResume = async (resumeUrl) => {
    try {
      const response = await userAxiosInstance.delete("/delete-resume", {
        data: { resumeUrl },
      });

      if (response.data.success) {
        toast.success("Resume removed successfully");
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to remove resume");
    }
  };

  // Profile update handling
  const handleUpdateProfile = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        values
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setUser(response.data.response || values);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // Education handling
  const openEducationDialog = (index = null) => {
    if (index !== null) {
      setCurrentEducation({ ...user.education[index] });
      setEducationIndex(index);
    } else {
      setCurrentEducation({
        qualification: "",
        institute: "",
        startYear: new Date().getFullYear(),
        endYear: null,
      });
      setEducationIndex(null);
    }
    setIsEducationDialogOpen(true);
  };

  const saveEducation = async (values, { setSubmitting, resetForm }) => {
    const updatedUser = { ...user };

    if (educationIndex !== null) {
      updatedUser.education[educationIndex] = values;
    } else {
      updatedUser.education = [...(updatedUser.education || []), values];
    }

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        toast.success(
          educationIndex !== null
            ? "Education updated successfully"
            : "Education added successfully"
        );
        setUser(response.data.response || updatedUser);
        setIsEducationDialogOpen(false);
        setCurrentEducation(null);
        setEducationIndex(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to save education");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEducation = async (index) => {
    const updatedUser = { ...user };
    updatedUser.education = updatedUser.education.filter((_, i) => i !== index);

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        toast.success("Education removed successfully");
        setUser(response.data.response || updatedUser);
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to remove education");
    }
  };

  // Experience handling
  const openExperienceDialog = (index = null) => {
    if (index !== null) {
      setCurrentExperience({ ...user.experience[index] });
      setExperienceIndex(index);
    } else {
      setCurrentExperience({
        company: "",
        jobTitle: "",
        startYear: new Date().getFullYear(),
        endYear: null,
      });
      setExperienceIndex(null);
    }
    setIsExperienceDialogOpen(true);
  };

  const saveExperience = async (values, { setSubmitting, resetForm }) => {
    const updatedUser = { ...user };

    if (experienceIndex !== null) {
      updatedUser.experience[experienceIndex] = values;
    } else {
      updatedUser.experience = [...(updatedUser.experience || []), values];
    }

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        toast.success(
          experienceIndex !== null
            ? "Experience updated successfully"
            : "Experience added successfully"
        );
        setUser(response.data.response || updatedUser);
        setIsExperienceDialogOpen(false);
        setCurrentExperience(null);
        setExperienceIndex(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Failed to save experience");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExperience = async (index) => {
    const updatedUser = { ...user };
    updatedUser.experience = updatedUser.experience.filter(
      (_, i) => i !== index
    );

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        toast.success("Experience removed successfully");
        setUser(response.data.response || updatedUser);
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Failed to remove experience");
    }
  };

  // Skills handling
  const openSkillsDialog = (index = null) => {
    if (index !== null) {
      const skill = user.skills[index];
      setCurrentSkill({ ...skill });
      setSkillIndex(index);
      setSelectedJobTitle(skill.skillTitle);
      setSelectedRequirements(skill.requireMents || []);
    } else {
      setCurrentSkill({
        skillTitle: "",
        requireMents: [],
      });
      setSkillIndex(null);
      setSelectedJobTitle("");
      setSelectedRequirements([]);
    }
    setIsSkillsDialogOpen(true);
  };

  const handleJobTitleChange = (jobTitle) => {
    setSelectedJobTitle(jobTitle);
    setSelectedRequirements([]); // Reset requirements when job title changes
  };

  const handleRequirementToggle = (requirement) => {
    setSelectedRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((req) => req !== requirement)
        : [...prev, requirement]
    );
  };

  const saveSkills = async () => {
    if (!selectedJobTitle || selectedRequirements.length === 0) {
      toast.error("Please select a job title and at least one skill");
      return;
    }

    const skillData = {
      skillTitle: selectedJobTitle,
      requireMents: selectedRequirements,
    };

    let updatedSkills;
    if (skillIndex !== null) {
      // Editing existing skill
      updatedSkills = [...(user.skills || [])];
      updatedSkills[skillIndex] = skillData;
    } else {
      // Adding new skill
      updatedSkills = [...(user.skills || []), skillData];
    }

    try {
      // Send skills wrapped in an object as expected by backend
      const response = await userAxiosInstance.post(
        `/update-skills/${userId}`,
        { skills: updatedSkills } // Wrap in object with 'skills' key
      );

      if (response.data.success) {
        toast.success(
          skillIndex !== null
            ? "Skills updated successfully"
            : "Skills added successfully"
        );

        // Update local state with the response data
        setUser(response.data.response);

        // Close dialog and reset state
        setIsSkillsDialogOpen(false);
        setSkillIndex(null);
        setSelectedJobTitle("");
        setSelectedRequirements([]);
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save skills";
      toast.error(errorMessage);
    }
  };

  // Replace the existing deleteSkill function with this fixed version
  const deleteSkill = async (index) => {
    try {
      const response = await userAxiosInstance.delete(
        `/delete-skill/${userId}/${index}`
      );

      if (response.data.success) {
        toast.success("Skill removed successfully");

        // Update local state by removing the skill at the specified index
        const updatedUser = { ...user };
        updatedUser.skills = updatedUser.skills.filter((_, i) => i !== index);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to remove skill";
      toast.error(errorMessage);
    }
  };

  const getAvailableRequirements = () => {
    const selectedJob = jobData.jobs.find(
      (job) => job.title === selectedJobTitle
    );
    return selectedJob ? selectedJob.requirements : [];
  };

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Failed to load user data
      </motion.div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const getResumeFileName = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.1 },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="bg-background min-h-screen py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border border-border rounded-lg shadow-sm overflow-hidden">
            <motion.div
              className="bg-muted/30 p-6 sm:p-8 border-b"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-md">
                    <AvatarImage
                      src={
                        user.profileUrl ||
                        "/placeholder.svg?height=112&width=112"
                      }
                      alt={fullName}
                    />
                    <AvatarFallback className="text-2xl">
                      {user.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background shadow-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  </motion.div>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    {fullName}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-3">
                    {user.location || "No location set"}
                  </p>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setTempUser({ ...user });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <Tabs
              defaultValue="about"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b sticky top-0 bg-background z-10">
                <TabsList className="bg-transparent h-auto p-0 w-full justify-start overflow-x-auto flex">
                  {["about", "resume", "education", "experience", "skills"].map(
                    (tab) => (
                      <motion.div
                        key={tab}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TabsTrigger
                          value={tab}
                          className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none font-medium capitalize"
                        >
                          {tab}
                        </TabsTrigger>
                      </motion.div>
                    )
                  )}
                </TabsList>
              </div>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <TabsContent value="about" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">About</h3>
                        <motion.div
                          className="bg-muted/20 rounded-lg p-4 mb-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-muted-foreground">
                            {user.about || "No about information provided."}
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {[
                            { label: "Full Name", value: fullName },
                            { label: "Email", value: user.email },
                            { label: "Phone", value: user.phone },
                            user.DOB && {
                              label: "Date of Birth",
                              value: new Date(user.DOB).toLocaleDateString(),
                            },
                            user.location && {
                              label: "Location",
                              value: user.location,
                            },
                          ]
                            .filter(Boolean)
                            .map((item, i) => (
                              <motion.div
                                key={item.label}
                                custom={i}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-1 p-3 rounded-md bg-muted/10"
                              >
                                <span className="text-xs font-medium text-muted-foreground uppercase">
                                  {item.label}
                                </span>
                                <p className="font-medium">{item.value}</p>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="resume" className="mt-0">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold">Resume</h3>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resumeInputRef.current?.click()}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              {user.resume ? "Change Resume" : "Add Resume"}
                            </Button>
                          </motion.div>
                          <input
                            type="file"
                            hidden
                            ref={resumeInputRef}
                            onChange={handleResumeUpload}
                            accept=".pdf"
                          />
                        </div>

                        {user.resume ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                              <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="bg-primary/10 p-2 rounded-md">
                                    <FileText className="h-6 w-6 text-primary" />
                                  </div>
                                  <div className="truncate max-w-[150px]">
                                    <p className="font-medium truncate">
                                      {getResumeFileName(user.resume)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      PDF Document
                                    </p>
                                  </div>
                                </div>
                                <motion.div
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                      handleRemoveResume(user.resume)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="bg-muted/20 rounded-lg p-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground mb-4">
                              No resume uploaded yet
                            </p>
                            <motion.div
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                variant="outline"
                                onClick={() => resumeInputRef.current?.click()}
                                className="mx-auto"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Upload Resume (PDF only)
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="education" className="mt-0">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold">Education</h3>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEducationDialog()}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Education
                            </Button>
                          </motion.div>
                        </div>

                        {user.education && user.education.length > 0 ? (
                          <div className="grid gap-4">
                            {user.education.map((edu, index) => (
                              <motion.div
                                key={index}
                                custom={index}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                                  <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                      <div className="flex-1">
                                        <h4 className="text-lg font-semibold mb-1">
                                          {edu.qualification}
                                        </h4>
                                        <p className="text-muted-foreground mb-1">
                                          {edu.institute}
                                        </p>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                          {edu.startYear} -{" "}
                                          {edu.endYear || "Present"}
                                        </div>
                                      </div>
                                      <div className="flex gap-2 sm:self-start">
                                        <motion.div
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              openEducationDialog(index)
                                            }
                                          >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                          </Button>
                                        </motion.div>
                                        <motion.div
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() =>
                                              deleteEducation(index)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                          </Button>
                                        </motion.div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <motion.div
                            className="bg-muted/20 rounded-lg p-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-muted-foreground mb-4">
                              No education history added yet
                            </p>
                            <motion.div
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                variant="outline"
                                onClick={() => openEducationDialog()}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Education
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="mt-0">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold">Experience</h3>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openExperienceDialog()}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Experience
                            </Button>
                          </motion.div>
                        </div>

                        {user.experience && user.experience.length > 0 ? (
                          <div className="grid gap-4">
                            {user.experience.map((exp, index) => (
                              <motion.div
                                key={index}
                                custom={index}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                                  <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                      <div className="flex-1">
                                        <h4 className="text-lg font-semibold mb-1">
                                          {exp.jobTitle}
                                        </h4>
                                        <p className="text-muted-foreground mb-1">
                                          {exp.company}
                                        </p>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                          {exp.startYear} -{" "}
                                          {exp.endYear || "Present"}
                                        </div>
                                      </div>
                                      <div className="flex gap-2 sm:self-start">
                                        <motion.div
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              openExperienceDialog(index)
                                            }
                                          >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                          </Button>
                                        </motion.div>
                                        <motion.div
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() =>
                                              deleteExperience(index)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                          </Button>
                                        </motion.div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <motion.div
                            className="bg-muted/20 rounded-lg p-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-muted-foreground mb-4">
                              No work experience added yet
                            </p>
                            <motion.div
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                variant="outline"
                                onClick={() => openExperienceDialog()}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Experience
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="skills" className="mt-0">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold">Skills</h3>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSkillsDialog()}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Skills
                            </Button>
                          </motion.div>
                        </div>

                        {user.skills && user.skills.length > 0 ? (
                          <div className="grid gap-4">
                            {user.skills.map((skill, index) => (
                              <motion.div
                                key={index}
                                custom={index}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                                  <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Award className="h-5 w-5 text-primary" />
                                          <h4 className="text-lg font-semibold">
                                            {skill.skillTitle}
                                          </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {skill.requireMents?.map(
                                            (requirement, reqIndex) => (
                                              <Badge
                                                key={reqIndex}
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                {requirement}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex gap-2 sm:self-start">
                                        <motion.div
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              openSkillsDialog(index)
                                            }
                                          >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                          </Button>
                                        </motion.div>
                                        <motion.div
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => deleteSkill(index)}
                                          >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                          </Button>
                                        </motion.div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <motion.div
                            className="bg-muted/20 rounded-lg p-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground mb-4">
                              No skills added yet
                            </p>
                            <motion.div
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                variant="outline"
                                onClick={() => openSkillsDialog()}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Skills
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </Card>
        </motion.div>
      </div>

      {/* Edit Profile Dialog with Formik */}
      <AnimatePresence>
        {isEditDialogOpen && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information below
                  </DialogDescription>
                </DialogHeader>
                <Formik
                  initialValues={{
                    firstName: tempUser?.firstName || "",
                    lastName: tempUser?.lastName || "",
                    email: tempUser?.email || "",
                    phone: tempUser?.phone || "",
                    about: tempUser?.about || "",
                    DOB: tempUser?.DOB
                      ? new Date(tempUser.DOB).toISOString().split("T")[0]
                      : "",
                    location: tempUser?.location || "",
                    ...tempUser,
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={handleUpdateProfile}
                >
                  {({ isSubmitting }) => (
                    <Form className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput
                          label="First Name"
                          name="firstName"
                          placeholder="Enter your first name"
                        />
                        <FormInput
                          label="Last Name"
                          name="lastName"
                          placeholder="Enter your last name"
                        />
                      </div>
                      <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                      <FormInput
                        label="Phone"
                        name="phone"
                        placeholder="Enter your phone number"
                      />
                      <FormInput
                        label="About"
                        name="about"
                        placeholder="Tell us about yourself"
                      />
                      <FormInput label="Date of Birth" name="DOB" type="date" />
                      <FormInput
                        label="Location"
                        name="location"
                        placeholder="Enter your location"
                      />
                      <DialogFooter className="border-t pt-4">
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </motion.div>
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </Button>
                        </motion.div>
                      </DialogFooter>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Education Dialog with Formik */}
      <AnimatePresence>
        {isEducationDialogOpen && (
          <Dialog
            open={isEducationDialogOpen}
            onOpenChange={setIsEducationDialogOpen}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {educationIndex !== null
                      ? "Edit Education"
                      : "Add Education"}
                  </DialogTitle>
                  <DialogDescription>
                    {educationIndex !== null
                      ? "Update your education details"
                      : "Add your education details"}
                  </DialogDescription>
                </DialogHeader>
                <Formik
                  initialValues={{
                    qualification: currentEducation?.qualification || "",
                    institute: currentEducation?.institute || "",
                    startYear:
                      currentEducation?.startYear || new Date().getFullYear(),
                    endYear: currentEducation?.endYear || "",
                  }}
                  validationSchema={EducationSchema}
                  onSubmit={saveEducation}
                >
                  {({ isSubmitting }) => (
                    <Form className="grid gap-4 py-4">
                      <FormInput
                        label="Qualification/Degree"
                        name="qualification"
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                      <FormInput
                        label="Institute/School"
                        name="institute"
                        placeholder="e.g. University of California"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput
                          label="Start Year"
                          name="startYear"
                          type="number"
                          placeholder="e.g. 2018"
                        />
                        <FormInput
                          label="End Year (or leave blank if current)"
                          name="endYear"
                          type="number"
                          placeholder="e.g. 2022"
                        />
                      </div>
                      <DialogFooter className="border-t pt-4">
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEducationDialogOpen(false);
                              setCurrentEducation(null);
                              setEducationIndex(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </motion.div>
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                              ? "Saving..."
                              : educationIndex !== null
                              ? "Update"
                              : "Add"}
                          </Button>
                        </motion.div>
                      </DialogFooter>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Experience Dialog with Formik */}
      <AnimatePresence>
        {isExperienceDialogOpen && (
          <Dialog
            open={isExperienceDialogOpen}
            onOpenChange={setIsExperienceDialogOpen}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {experienceIndex !== null
                      ? "Edit Experience"
                      : "Add Experience"}
                  </DialogTitle>
                  <DialogDescription>
                    {experienceIndex !== null
                      ? "Update your work experience"
                      : "Add your work experience"}
                  </DialogDescription>
                </DialogHeader>
                <Formik
                  initialValues={{
                    jobTitle: currentExperience?.jobTitle || "",
                    company: currentExperience?.company || "",
                    startYear:
                      currentExperience?.startYear || new Date().getFullYear(),
                    endYear: currentExperience?.endYear || "",
                  }}
                  validationSchema={ExperienceSchema}
                  onSubmit={saveExperience}
                >
                  {({ isSubmitting }) => (
                    <Form className="grid gap-4 py-4">
                      <FormInput
                        label="Job Title"
                        name="jobTitle"
                        placeholder="e.g. Software Engineer"
                      />
                      <FormInput
                        label="Company"
                        name="company"
                        placeholder="e.g. Google"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput
                          label="Start Year"
                          name="startYear"
                          type="number"
                          placeholder="e.g. 2020"
                        />
                        <FormInput
                          label="End Year (or leave blank if current)"
                          name="endYear"
                          type="number"
                          placeholder="e.g. 2023"
                        />
                      </div>
                      <DialogFooter className="border-t pt-4">
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsExperienceDialogOpen(false);
                              setCurrentExperience(null);
                              setExperienceIndex(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </motion.div>
                        <motion.div
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                              ? "Saving..."
                              : experienceIndex !== null
                              ? "Update"
                              : "Add"}
                          </Button>
                        </motion.div>
                      </DialogFooter>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Skills Dialog */}
      <AnimatePresence>
        {isSkillsDialogOpen && (
          <Dialog
            open={isSkillsDialogOpen}
            onOpenChange={setIsSkillsDialogOpen}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {skillIndex !== null ? "Edit Skills" : "Add Skills"}
                  </DialogTitle>
                  <DialogDescription>
                    Select a job title and choose your skills from the available
                    requirements
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  {/* Job Title Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Select
                      value={selectedJobTitle}
                      onValueChange={handleJobTitleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job title" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobData.jobs.map((job) => (
                          <SelectItem key={job.title} value={job.title}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Requirements Selection */}
                  {selectedJobTitle && (
                    <div className="grid gap-3">
                      <Label>Skills & Requirements</Label>
                      <div className="grid gap-3 max-h-60 overflow-y-auto border rounded-md p-3">
                        {getAvailableRequirements().map((requirement) => (
                          <div
                            key={requirement}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={requirement}
                              checked={selectedRequirements.includes(
                                requirement
                              )}
                              onCheckedChange={() =>
                                handleRequirementToggle(requirement)
                              }
                            />
                            <Label
                              htmlFor={requirement}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {requirement}
                            </Label>
                          </div>
                        ))}
                      </div>

                      {/* Selected Requirements Preview */}
                      {selectedRequirements.length > 0 && (
                        <div className="mt-3">
                          <Label className="text-sm text-muted-foreground">
                            Selected Skills ({selectedRequirements.length})
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedRequirements.map((requirement) => (
                              <Badge
                                key={requirement}
                                variant="secondary"
                                className="text-xs"
                              >
                                {requirement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="border-t pt-4">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsSkillsDialogOpen(false);
                        setCurrentSkill(null);
                        setSkillIndex(null);
                        setSelectedJobTitle("");
                        setSelectedRequirements([]);
                      }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      onClick={saveSkills}
                      disabled={
                        !selectedJobTitle || selectedRequirements.length === 0
                      }
                    >
                      {skillIndex !== null ? "Update Skills" : "Add Skills"}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Profile Image Confirmation Dialog */}
      <AnimatePresence>
        {isImageConfirmationOpen && (
          <Dialog
            open={isImageConfirmationOpen}
            onOpenChange={setIsImageConfirmationOpen}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Confirm Profile Picture</DialogTitle>
                  <DialogDescription>
                    Would you like to use this image as your profile picture?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={
                        previewImageUrl ||
                        user.profileUrl ||
                        "/placeholder.svg?height=80&width=80" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="Profile preview"
                    />
                    <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <DialogFooter className="flex justify-between border-t pt-4">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button variant="outline" onClick={cancelImageUpload}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button onClick={confirmImageUpload}>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Resume Confirmation Dialog */}
      <AnimatePresence>
        {isResumeConfirmationOpen && (
          <Dialog
            open={isResumeConfirmationOpen}
            onOpenChange={setIsResumeConfirmationOpen}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Confirm Resume Upload</DialogTitle>
                  <DialogDescription>
                    Would you like to upload this resume to your profile?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-3 py-4">
                  <FileText className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium">{selectedResumeFile?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedResumeFile
                        ? `${(selectedResumeFile.size / 1024 / 1024).toFixed(
                            2
                          )} MB`
                        : ""}
                    </p>
                  </div>
                </div>
                <DialogFooter className="flex justify-between border-t pt-4">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsResumeConfirmationOpen(false);
                        setSelectedResumeFile(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button onClick={confirmResumeUpload}>
                      <Check className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
