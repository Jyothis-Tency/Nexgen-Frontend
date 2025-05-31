"use client";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Award,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  ArrowRight,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import userAxiosInstance from "../../../config/axiosConfig/userAxiosInstance";
import { jobData } from "../../../data/Job_titles";

// Enhanced Validation Schema
const CompleteProfileSchema = Yup.object().shape({
  about: Yup.string().max(500, "About must be less than 500 characters"),
  DOB: Yup.date().nullable(),
  location: Yup.string().max(100, "Location must be less than 100 characters"),
  isStudent: Yup.boolean(),
  education: Yup.array().of(
    Yup.object().shape({
      qualification: Yup.string().required("Qualification is required"),
      institute: Yup.string().required("Institute is required"),
      startYear: Yup.number().required("Start year is required"),
      endYear: Yup.number().nullable(),
    })
  ),
  experience: Yup.array().of(
    Yup.object().shape({
      jobTitle: Yup.string().required("Job title is required"),
      company: Yup.string().required("Company is required"),
      startYear: Yup.number().required("Start year is required"),
      endYear: Yup.number().nullable(),
    })
  ),
  // Remove skills validation from Yup since we handle it separately
});

export default function CompleteProfile() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.seekerInfo.userId);
  const userInfo = useSelector((state) => state.user.seekerInfo);

  const [currentStep, setCurrentStep] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Education", icon: GraduationCap },
    { title: "Experience", icon: Briefcase },
    { title: "Skills", icon: Award },
    { title: "Final Review", icon: CheckCircle },
  ];

  const initialValues = {
    about: "",
    DOB: "",
    location: "",
    isStudent: false,
    education: [],
    experience: [],
  };

  // Handle profile image upload with validation
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
      "image/svg+xml",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      toast.error(
        "Please upload a valid image file (JPEG, PNG, GIF, WEBP, BMP, TIFF, SVG)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setProfileImage(file);
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
    toast.success("Profile image selected successfully");
  };

  // Handle resume upload with validation
  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedDocumentTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/rtf",
    ];

    if (!allowedDocumentTypes.includes(file.type)) {
      toast.error(
        "Please upload a valid document file (PDF, DOC, DOCX, TXT, RTF)"
      );
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size should be less than 20MB");
      return;
    }

    setResumeFile(file);
    toast.success("Resume selected successfully");
  };

  // Handle skills management
  const addSkill = (jobTitle, requirements) => {
    if (!jobTitle || requirements.length === 0) {
      toast.error("Please select a job title and at least one requirement");
      return;
    }

    // Check if skill already exists
    const existingSkill = selectedSkills.find(
      (skill) => skill.skillTitle === jobTitle
    );
    if (existingSkill) {
      toast.error("This skill has already been added");
      return;
    }

    const newSkill = {
      skillTitle: jobTitle,
      requireMents: requirements,
    };

    setSelectedSkills([...selectedSkills, newSkill]);
    toast.success("Skill added successfully");
  };

  const removeSkill = (index) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
    toast.success("Skill removed");
  };

  // Calculate progress
  const calculateProgress = (values) => {
    let completed = 0;
    const total = 6;

    if (values.about) completed++;
    if (values.location) completed++;
    if (values.education.length > 0) completed++;
    if (values.experience.length > 0) completed++;
    if (selectedSkills.length > 0) completed++;
    if (profileImage || resumeFile) completed++;

    return (completed / total) * 100;
  };

  // Enhanced form submission with better error handling
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form values:", values);
    console.log("Selected skills:", selectedSkills);
    console.log("Profile image:", profileImage?.name);
    console.log("Resume file:", resumeFile?.name);
    console.log("User ID:", userId);

    // Clear previous errors
    setFormErrors({});

    // Validate skills requirement
    if (selectedSkills.length === 0) {
      const error = "At least one skill is required to complete your profile";
      setFormErrors({ skills: error });
      toast.error(error);
      setSubmitting(false);
      return;
    }

    // Validate user ID
    if (!userId) {
      const error = "User ID is missing. Please log in again.";
      setFormErrors({ submit: error });
      toast.error(error);
      setSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData with proper structure matching your backend expectations
      const formData = new FormData();

      // Add profile data as JSON string (matching your backend parsing)
      const profileData = {
        ...values,
        skills: selectedSkills,
        isProfileComplete: true,
      };

      console.log("Profile data to send:", profileData);
      formData.append("profileData", JSON.stringify(profileData));

      // Add files with the field name "files" as expected by multer array configuration
      const fileMetadata = {};

      if (profileImage) {
        formData.append("files", profileImage);
        fileMetadata.profileImg = profileImage.name;
        console.log(
          "Added profile image:",
          profileImage.name,
          "Type:",
          profileImage.type,
          "Size:",
          profileImage.size
        );
      }

      if (resumeFile) {
        formData.append("files", resumeFile);
        fileMetadata.resume = resumeFile.name;
        console.log(
          "Added resume file:",
          resumeFile.name,
          "Type:",
          resumeFile.type,
          "Size:",
          resumeFile.size
        );
      }

      // Add file metadata if we have files (matching your backend logic)
      if (Object.keys(fileMetadata).length > 0) {
        formData.append("fileMetadata", JSON.stringify(fileMetadata));
        console.log("File metadata:", fileMetadata);
      }

      // Log FormData contents for debugging
      console.log("=== FORM DATA CONTENTS ===");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const apiUrl = `/complete-profile/${userId}`;
      console.log("Making API request to:", apiUrl);

      // Submit to backend with proper configuration
      const response = await userAxiosInstance.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      console.log("=== API RESPONSE ===");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.data.success) {
        toast.success("Profile completed successfully!");

        // Clean up preview URLs
        if (profileImagePreview) {
          URL.revokeObjectURL(profileImagePreview);
        }

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to complete profile");
      }
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error object:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);

        // Handle specific error cases
        if (error.response.status === 400) {
          const errorData = error.response.data;
          if (errorData.errors) {
            // Handle validation errors
            Object.keys(errorData.errors).forEach((field) => {
              setFieldError(field, errorData.errors[field]);
            });
          }
        } else if (error.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/login");
          return;
        } else if (error.response.status === 413) {
          toast.error("File size too large. Please upload smaller files.");
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        }
      } else if (error.request) {
        console.error("Request was made but no response received");
        console.error("Request details:", error.request);
        toast.error(
          "Network error: Unable to reach the server. Please check your connection."
        );
      } else {
        console.error("Error setting up request:", error.message);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to complete profile. Please try again.";
      toast.error(errorMessage);

      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Find the nextStep function and modify it to prevent form submission when moving to the final step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Prevent accidental form submission when moving to the final step
      if (currentStep === steps.length - 2) {
        // This is the transition to the final review step
        // Set a small timeout to ensure React state updates properly
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 10);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Clean up preview URL on component unmount
  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-8">
      {/* Steps indicator */}
      <div className="bg-blue-600 py-6 px-4 mb-8 rounded-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Complete Your Profile
        </h1>
        <p className="text-blue-100 text-center mb-6">
          Help us know you better to provide personalized job recommendations
        </p>

        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index <= currentStep ? "text-white" : "text-blue-300"
              }`}
              onClick={() => {
                if (index < currentStep) {
                  setCurrentStep(index);
                }
              }}
              style={{ cursor: index < currentStep ? "pointer" : "default" }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  index <= currentStep
                    ? "bg-white text-blue-600"
                    : "bg-blue-500 text-blue-200"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              {/* Also modify the Form component to explicitly prevent default submission behavior */}
              <Formik
                initialValues={initialValues}
                validationSchema={CompleteProfileSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  setFieldValue,
                  isSubmitting: formikSubmitting,
                  errors,
                  touched,
                  handleSubmit: formikHandleSubmit,
                }) => (
                  <Form
                    onSubmit={(e) => {
                      // Only allow submission from the final step when clicking the submit button
                      if (currentStep !== steps.length - 1) {
                        e.preventDefault();
                        return false;
                      }
                    }}
                  >
                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Profile Completion</span>
                        <span>{Math.round(calculateProgress(values))}%</span>
                      </div>
                      <Progress
                        value={calculateProgress(values)}
                        className="h-2"
                      />
                    </div>

                    {/* Display form errors */}
                    {formErrors.submit && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">
                          {formErrors.submit}
                        </p>
                      </div>
                    )}

                    {formErrors.skills && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">
                          {formErrors.skills}
                        </p>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Step 0: Personal Information */}
                        {currentStep === 0 && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <User className="w-5 h-5 mr-2 text-blue-600" />
                              Personal Information
                            </h3>

                            {/* Profile Image */}
                            <div className="flex flex-col items-center space-y-4">
                              <div className="relative">
                                <Avatar className="w-24 h-24">
                                  <AvatarImage
                                    src={
                                      profileImagePreview ||
                                      "/placeholder.svg?height=96&width=96"
                                    }
                                    alt="Profile"
                                  />
                                  <AvatarFallback>
                                    {userInfo?.firstName?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="absolute -bottom-1 -right-1 rounded-full"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Camera className="w-4 h-4" />
                                </Button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                  accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                                  className="hidden"
                                />
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">
                                  Upload a profile picture (optional)
                                </p>
                                <p className="text-xs text-gray-500">
                                  Supported: JPEG, PNG, GIF, WEBP, BMP, TIFF,
                                  SVG
                                </p>
                                {profileImage && (
                                  <p className="text-xs text-green-600 mt-1">
                                    ✓ {profileImage.name} selected
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* About */}
                            <div>
                              <Label htmlFor="about">About Yourself</Label>
                              <Field name="about">
                                {({ field }) => (
                                  <Textarea
                                    {...field}
                                    placeholder="Tell us about yourself, your interests, and career goals..."
                                    className="mt-1"
                                    rows={4}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="about"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Date of Birth */}
                            <div>
                              <Label htmlFor="DOB">Date of Birth</Label>
                              <Field name="DOB">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    type="date"
                                    className="mt-1"
                                  />
                                )}
                              </Field>
                            </div>

                            {/* Location */}
                            <div>
                              <Label htmlFor="location">Location</Label>
                              <Field name="location">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="City, State, Country"
                                    className="mt-1"
                                  />
                                )}
                              </Field>
                            </div>

                            {/* Student Status */}
                            <div className="flex items-center space-x-2">
                              <Field name="isStudent">
                                {({ field }) => (
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      setFieldValue("isStudent", checked)
                                    }
                                  />
                                )}
                              </Field>
                              <Label>I am currently a student</Label>
                            </div>

                            {/* Resume Upload */}
                            <div>
                              <Label>Resume (Optional)</Label>
                              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  {resumeFile ? (
                                    <span className="text-green-600">
                                      ✓ {resumeFile.name} selected
                                    </span>
                                  ) : (
                                    "Upload your resume"
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 mb-3">
                                  Supported: PDF, DOC, DOCX, TXT, RTF (Max 20MB)
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    resumeInputRef.current?.click()
                                  }
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  {resumeFile ? "Change File" : "Choose File"}
                                </Button>
                                <input
                                  type="file"
                                  ref={resumeInputRef}
                                  onChange={handleResumeUpload}
                                  accept=".pdf,.doc,.docx,.txt,.rtf"
                                  className="hidden"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 1: Education */}
                        {currentStep === 1 && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                              Education (Optional)
                            </h3>

                            <FieldArray name="education">
                              {({ push, remove }) => (
                                <div className="space-y-4">
                                  {values.education.map((_, index) => (
                                    <Card
                                      key={index}
                                      className="p-4 border border-gray-200"
                                    >
                                      <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-medium">
                                          Education {index + 1}
                                        </h4>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => remove(index)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Qualification/Degree</Label>
                                          <Field
                                            name={`education.${index}.qualification`}
                                            as={Input}
                                            placeholder="e.g., Bachelor of Science"
                                          />
                                          <ErrorMessage
                                            name={`education.${index}.qualification`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>Institute/University</Label>
                                          <Field
                                            name={`education.${index}.institute`}
                                            as={Input}
                                            placeholder="e.g., Harvard University"
                                          />
                                          <ErrorMessage
                                            name={`education.${index}.institute`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>Start Year</Label>
                                          <Field
                                            name={`education.${index}.startYear`}
                                            as={Input}
                                            type="number"
                                            placeholder="2018"
                                          />
                                          <ErrorMessage
                                            name={`education.${index}.startYear`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>
                                            End Year (Leave blank if current)
                                          </Label>
                                          <Field
                                            name={`education.${index}.endYear`}
                                            as={Input}
                                            type="number"
                                            placeholder="2022"
                                          />
                                        </div>
                                      </div>
                                    </Card>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      push({
                                        qualification: "",
                                        institute: "",
                                        startYear: "",
                                        endYear: "",
                                      })
                                    }
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Education
                                  </Button>
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        )}

                        {/* Step 2: Experience */}
                        {currentStep === 2 && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                              Work Experience (Optional)
                            </h3>

                            <FieldArray name="experience">
                              {({ push, remove }) => (
                                <div className="space-y-4">
                                  {values.experience.map((_, index) => (
                                    <Card
                                      key={index}
                                      className="p-4 border border-gray-200"
                                    >
                                      <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-medium">
                                          Experience {index + 1}
                                        </h4>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => remove(index)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Job Title</Label>
                                          <Field
                                            name={`experience.${index}.jobTitle`}
                                            as={Input}
                                            placeholder="e.g., Software Engineer"
                                          />
                                          <ErrorMessage
                                            name={`experience.${index}.jobTitle`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>Company</Label>
                                          <Field
                                            name={`experience.${index}.company`}
                                            as={Input}
                                            placeholder="e.g., Google"
                                          />
                                          <ErrorMessage
                                            name={`experience.${index}.company`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>Start Year</Label>
                                          <Field
                                            name={`experience.${index}.startYear`}
                                            as={Input}
                                            type="number"
                                            placeholder="2020"
                                          />
                                          <ErrorMessage
                                            name={`experience.${index}.startYear`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>
                                            End Year (Leave blank if current)
                                          </Label>
                                          <Field
                                            name={`experience.${index}.endYear`}
                                            as={Input}
                                            type="number"
                                            placeholder="2023"
                                          />
                                        </div>
                                      </div>
                                    </Card>
                                  ))}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      push({
                                        jobTitle: "",
                                        company: "",
                                        startYear: "",
                                        endYear: "",
                                      })
                                    }
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Experience
                                  </Button>
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        )}

                        {/* Step 3: Skills (Mandatory) */}
                        {currentStep === 3 && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <Award className="w-5 h-5 mr-2 text-blue-600" />
                              Skills (Required){" "}
                              <span className="text-red-500 ml-1">*</span>
                            </h3>

                            <SkillsSelector onAddSkill={addSkill} />

                            {/* Selected Skills */}
                            {selectedSkills.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-3">
                                  Selected Skills:
                                </h4>
                                <div className="space-y-3">
                                  {selectedSkills.map((skill, index) => (
                                    <Card
                                      key={index}
                                      className="p-4 border border-gray-200"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h5 className="font-medium text-blue-600">
                                            {skill.skillTitle}
                                          </h5>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {skill.requireMents.map(
                                              (req, reqIndex) => (
                                                <Badge
                                                  key={reqIndex}
                                                  variant="secondary"
                                                  className="text-xs"
                                                >
                                                  {req}
                                                </Badge>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeSkill(index)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedSkills.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>
                                  No skills selected yet. Please add at least
                                  one skill to continue.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                              Review Your Profile
                            </h3>

                            <div className="grid gap-6">
                              {/* Personal Info Summary */}
                              <Card className="p-4">
                                <h4 className="font-medium mb-3">
                                  Personal Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <strong>Name:</strong> {userInfo?.firstName}{" "}
                                    {userInfo?.lastName}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {userInfo?.email}
                                  </p>
                                  {values.about && (
                                    <p>
                                      <strong>About:</strong> {values.about}
                                    </p>
                                  )}
                                  {values.location && (
                                    <p>
                                      <strong>Location:</strong>{" "}
                                      {values.location}
                                    </p>
                                  )}
                                  {values.DOB && (
                                    <p>
                                      <strong>Date of Birth:</strong>{" "}
                                      {values.DOB}
                                    </p>
                                  )}
                                  <p>
                                    <strong>Student:</strong>{" "}
                                    {values.isStudent ? "Yes" : "No"}
                                  </p>
                                  {profileImage && (
                                    <p>
                                      <strong>Profile Image:</strong> ✓{" "}
                                      {profileImage.name}
                                    </p>
                                  )}
                                  {resumeFile && (
                                    <p>
                                      <strong>Resume:</strong> ✓{" "}
                                      {resumeFile.name}
                                    </p>
                                  )}
                                </div>
                              </Card>

                              {/* Education Summary */}
                              {values.education.length > 0 && (
                                <Card className="p-4">
                                  <h4 className="font-medium mb-3">
                                    Education
                                  </h4>
                                  {values.education.map((edu, index) => (
                                    <div key={index} className="mb-2 text-sm">
                                      <p>
                                        <strong>{edu.qualification}</strong>{" "}
                                        from {edu.institute}
                                      </p>
                                      <p className="text-gray-600">
                                        {edu.startYear} -{" "}
                                        {edu.endYear || "Present"}
                                      </p>
                                    </div>
                                  ))}
                                </Card>
                              )}

                              {/* Experience Summary */}
                              {values.experience.length > 0 && (
                                <Card className="p-4">
                                  <h4 className="font-medium mb-3">
                                    Experience
                                  </h4>
                                  {values.experience.map((exp, index) => (
                                    <div key={index} className="mb-2 text-sm">
                                      <p>
                                        <strong>{exp.jobTitle}</strong> at{" "}
                                        {exp.company}
                                      </p>
                                      <p className="text-gray-600">
                                        {exp.startYear} -{" "}
                                        {exp.endYear || "Present"}
                                      </p>
                                    </div>
                                  ))}
                                </Card>
                              )}

                              {/* Skills Summary */}
                              <Card className="p-4">
                                <h4 className="font-medium mb-3">Skills</h4>
                                {selectedSkills.map((skill, index) => (
                                  <div key={index} className="mb-3">
                                    <p className="font-medium text-blue-600">
                                      {skill.skillTitle}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {skill.requireMents.map(
                                        (req, reqIndex) => (
                                          <Badge
                                            key={reqIndex}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {req}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </Card>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>

                      {currentStep < steps.length - 1 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={
                            currentStep === 3 && selectedSkills.length === 0
                          }
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        // And update the final submit button to use formikHandleSubmit
                        <Button
                          type="button" // Change to button type
                          onClick={(e) => {
                            e.preventDefault();
                            if (selectedSkills.length === 0) {
                              toast.error("At least one skill is required");
                              return;
                            }
                            formikHandleSubmit(); // Manually trigger form submission
                          }}
                          disabled={
                            isSubmitting ||
                            formikSubmitting ||
                            selectedSkills.length === 0
                          }
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {isSubmitting || formikSubmitting
                            ? "Completing..."
                            : "Complete Profile"}
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Skills Selector Component using your actual job data
function SkillsSelector({ onAddSkill }) {
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState([]);

  const handleJobTitleChange = (jobTitle) => {
    setSelectedJobTitle(jobTitle);
    setSelectedRequirements([]);
  };

  const handleRequirementToggle = (requirement) => {
    setSelectedRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((req) => req !== requirement)
        : [...prev, requirement]
    );
  };

  const handleAddSkill = () => {
    if (selectedJobTitle && selectedRequirements.length > 0) {
      onAddSkill(selectedJobTitle, selectedRequirements);
      setSelectedJobTitle("");
      setSelectedRequirements([]);
    }
  };

  const getAvailableRequirements = () => {
    const selectedJob = jobData.jobs.find(
      (job) => job.title === selectedJobTitle
    );
    return selectedJob ? selectedJob.requirements : [];
  };

  return (
    <Card className="p-4 border border-gray-200">
      <div className="space-y-4">
        {/* Job Title Selection */}
        <div>
          <Label>Select Job Title</Label>
          <Select value={selectedJobTitle} onValueChange={handleJobTitleChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a job title" />
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
          <div>
            <Label>Select Skills & Requirements</Label>
            <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
              {getAvailableRequirements().map((requirement) => (
                <div key={requirement} className="flex items-center space-x-2">
                  <Checkbox
                    id={requirement}
                    checked={selectedRequirements.includes(requirement)}
                    onCheckedChange={() => handleRequirementToggle(requirement)}
                  />
                  <Label
                    htmlFor={requirement}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {requirement}
                  </Label>
                </div>
              ))}
            </div>

            {selectedRequirements.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">
                  Selected: {selectedRequirements.length} skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedRequirements.map((req) => (
                    <Badge key={req} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAddSkill}
              disabled={selectedRequirements.length === 0}
              className="w-full mt-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add This Skill Set
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
