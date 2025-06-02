"use client";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Building2,
  FileText,
  Globe,
  Upload,
  CheckCircle,
  ArrowRight,
  Camera,
  MapPin,
  Phone,
  Mail,
  LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import employerAxiosInstance from "../../../config/axiosConfig/employerAxiosInstance";

// Updated Validation Schema - Only essential fields are required
const EmployerProfileSchema = Yup.object().shape({
  // Personal Details - Required
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  location: Yup.string().required("Location is required"),

  // Personal Details - Optional
  about: Yup.string().max(500, "About must be less than 500 characters"),

  // Company Details - All Optional (can be added later)
  companyName: Yup.string(),
  companyEmail: Yup.string().email("Invalid email"),
  companyPhone: Yup.string(),
  companyAddress: Yup.string(),
  companyAbout: Yup.string().max(
    1000,
    "Company description must be less than 1000 characters"
  ),
  webSite: Yup.string().url("Invalid website URL"),

  // Social Links - Optional
  socialLinks: Yup.object().shape({
    linkedin: Yup.string().url("Invalid LinkedIn URL"),
    twitter: Yup.string().url("Invalid Twitter URL"),
    facebook: Yup.string().url("Invalid Facebook URL"),
  }),
});

export default function EmployerCompleteProfile() {
  const navigate = useNavigate();
  const employer = useSelector((state) => state.employer.employer);
  const employerId = employer?.employerId;

  const [currentStep, setCurrentStep] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [companyCertificate, setCompanyCertificate] = useState(null);
  const [selectedSocialPlatforms, setSelectedSocialPlatforms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [skipCompanyInfo, setSkipCompanyInfo] = useState(false);

  const profileImageRef = useRef(null);
  const companyLogoRef = useRef(null);
  const companyCertificateRef = useRef(null);

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Company Details", icon: Building2 },
    { title: "Company Assets", icon: FileText },
    { title: "Social Links", icon: Globe },
    { title: "Final Review", icon: CheckCircle },
  ];

  const socialPlatforms = ["LinkedIn", "Twitter", "Facebook"];

  const initialValues = {
    // Personal Details - Required
    name: employer?.name || "",
    email: employer?.email || "",
    phone: employer?.phone || "",
    location: employer?.location || "",
    about: employer?.about || "",

    // Company Details - Optional
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyAbout: "",
    webSite: "",

    // Social Links - Optional
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
    },
  };

  // Handle profile image upload
  const handleProfileImageUpload = (event) => {
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

  // Handle company logo upload
  const handleCompanyLogoUpload = (event) => {
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
      toast.error("Please upload a valid image file for company logo");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo size should be less than 5MB");
      return;
    }

    setCompanyLogo(file);
    const previewUrl = URL.createObjectURL(file);
    setCompanyLogoPreview(previewUrl);
    toast.success("Company logo selected successfully");
  };

  // Handle company certificate upload
  const handleCompanyCertificateUpload = (event) => {
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
      toast.error("Certificate file size should be less than 20MB");
      return;
    }

    setCompanyCertificate(file);
    toast.success("Company certificate selected successfully");
  };

  // Handle social platform selection
  const toggleSocialPlatform = (platform) => {
    setSelectedSocialPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Updated progress calculation - count all possible fields for 100% completion
  const calculateProgress = (values) => {
    let completed = 0;
    let total = 0;

    // Personal Details (4 fields) - Required
    const personalFields = ["name", "email", "phone", "location"];
    personalFields.forEach((field) => {
      total++;
      if (values[field]) completed++;
    });

    // Personal About (1 field) - Optional
    total++;
    if (values.about) completed++;

    // Profile Image (1 field) - Optional
    total++;
    if (profileImage) completed++;

    // Company Details (6 fields) - Optional
    const companyFields = [
      "companyName",
      "companyEmail",
      "companyPhone",
      "companyAddress",
      "companyAbout",
      "webSite",
    ];
    companyFields.forEach((field) => {
      total++;
      if (values[field]) completed++;
    });

    // Company Assets (2 fields) - Optional
    total++;
    if (companyLogo) completed++;
    total++;
    if (companyCertificate) completed++;

    // Social Links (3 fields) - Optional
    const socialFields = ["linkedin", "twitter", "facebook"];
    socialFields.forEach((field) => {
      total++;
      if (values.socialLinks?.[field]) completed++;
    });

    return Math.round((completed / total) * 100);
  };

  // Enhanced form submission with relaxed validation
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log("=== EMPLOYER PROFILE SUBMISSION STARTED ===");
    console.log("Form values:", values);
    console.log("Profile image:", profileImage?.name);
    console.log("Company logo:", companyLogo?.name);
    console.log("Company certificate:", companyCertificate?.name);
    console.log("Employer ID:", employerId);

    // Clear previous errors
    setFormErrors({});

    // Only validate required personal fields
    if (!values.name || !values.email || !values.phone || !values.location) {
      const error =
        "Personal information (name, email, phone, location) is required";
      setFormErrors({ submit: error });
      toast.error(error);
      setSubmitting(false);
      return;
    }

    // Validate employer ID
    if (!employerId) {
      const error = "Employer ID is missing. Please log in again.";
      setFormErrors({ submit: error });
      toast.error(error);
      setSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Add employer profile data
      const employerProfileData = {
        employerId: employerId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: values.location,
        about: values.about || "",
        isProfileComplete: true,
      };

      // Add company data only if provided
      const companyData = {};
      if (values.companyName) companyData.companyName = values.companyName;
      if (values.companyEmail) companyData.email = values.companyEmail;
      if (values.companyPhone) companyData.phone = values.companyPhone;
      if (values.companyAddress) companyData.address = values.companyAddress;
      if (values.companyAbout) companyData.about = values.companyAbout;
      if (values.webSite) companyData.webSite = values.webSite;
      if (values.socialLinks) companyData.socialLinks = values.socialLinks;

      console.log("Employer profile data:", employerProfileData);
      console.log("Company data:", companyData);

      formData.append(
        "employerProfileData",
        JSON.stringify(employerProfileData)
      );
      formData.append("companyData", JSON.stringify(companyData));

      // Add files with metadata
      const fileMetadata = {};

      if (profileImage) {
        formData.append("files", profileImage);
        fileMetadata.profileImage = profileImage.name;
        console.log("Added profile image:", profileImage.name);
      }

      if (companyLogo) {
        formData.append("files", companyLogo);
        fileMetadata.companyLogo = companyLogo.name;
        console.log("Added company logo:", companyLogo.name);
      }

      if (companyCertificate) {
        formData.append("files", companyCertificate);
        fileMetadata.companyCertificate = companyCertificate.name;
        console.log("Added company certificate:", companyCertificate.name);
      }

      // Add file metadata if we have files
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

      const apiUrl = `/complete-employer-profile/${employerId}`;
      console.log("Making API request to:", apiUrl);

      // Submit to backend
      const response = await employerAxiosInstance.post(apiUrl, formData, {
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
        toast.success("Employer profile completed successfully!");

        // Clean up preview URLs
        if (profileImagePreview) {
          URL.revokeObjectURL(profileImagePreview);
        }
        if (companyLogoPreview) {
          URL.revokeObjectURL(companyLogoPreview);
        }

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/employer/dashboard");
        }, 1500);
      } else {
        throw new Error(
          response.data.message || "Failed to complete employer profile"
        );
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
          navigate("/employer/login");
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
        "Failed to complete employer profile. Please try again.";
      toast.error(errorMessage);

      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Clean up preview URLs on component unmount
  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
      if (companyLogoPreview) {
        URL.revokeObjectURL(companyLogoPreview);
      }
    };
  }, [profileImagePreview, companyLogoPreview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8 pb-8">
      {/* Steps indicator */}
      <div className="bg-blue-600 py-6 px-4 mb-8 rounded-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Complete Your Employer Profile
        </h1>
        <p className="text-blue-100 text-center mb-6">
          Set up your employer profile. Company information can be added later
          if needed.
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
              <Formik
                initialValues={initialValues}
                validationSchema={EmployerProfileSchema}
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
                      // Only allow submission from the final step
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
                      <p className="text-xs text-gray-500 mt-1">
                        Complete all fields including optional company and
                        social information for 100% completion.
                      </p>
                    </div>

                    {/* Display form errors */}
                    {formErrors.submit && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">
                          {formErrors.submit}
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
                              <span className="text-red-500 ml-2 text-sm">
                                (Required)
                              </span>
                            </h3>

                            {/* Profile Image */}
                            <div className="flex flex-col items-center space-y-4">
                              <div className="relative">
                                <Avatar className="w-24 h-24">
                                  <AvatarImage
                                    src={
                                      profileImagePreview ||
                                      "/placeholder.svg?height=96&width=96" ||
                                      "/placeholder.svg"
                                    }
                                    alt="Profile"
                                  />
                                  <AvatarFallback>
                                    {employer?.name?.charAt(0) || "E"}
                                  </AvatarFallback>
                                </Avatar>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="absolute -bottom-1 -right-1 rounded-full"
                                  onClick={() =>
                                    profileImageRef.current?.click()
                                  }
                                >
                                  <Camera className="w-4 h-4" />
                                </Button>
                                <input
                                  type="file"
                                  ref={profileImageRef}
                                  onChange={handleProfileImageUpload}
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

                            {/* Name */}
                            <div>
                              <Label htmlFor="name">
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Field name="name">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Enter your full name"
                                    className="mt-1"
                                    icon={<User className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Email */}
                            <div>
                              <Label htmlFor="email">
                                Email Address{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Field name="email">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="mt-1"
                                    icon={<Mail className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Phone */}
                            <div>
                              <Label htmlFor="phone">
                                Phone Number{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Field name="phone">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Enter your phone number"
                                    className="mt-1"
                                    icon={<Phone className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Location */}
                            <div>
                              <Label htmlFor="location">
                                Location <span className="text-red-500">*</span>
                              </Label>
                              <Field name="location">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="City, State, Country"
                                    className="mt-1"
                                    icon={<MapPin className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="location"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* About */}
                            <div>
                              <Label htmlFor="about">
                                About Yourself (Optional)
                              </Label>
                              <Field name="about">
                                {({ field }) => (
                                  <Textarea
                                    {...field}
                                    placeholder="Tell us about yourself, your experience, and what you're looking for in candidates..."
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
                          </div>
                        )}

                        {/* Step 1: Company Details */}
                        {currentStep === 1 && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                Company Information (Optional)
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentStep(4)} // Skip to review
                                className="text-gray-600"
                              >
                                Skip for now
                              </Button>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                              <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Company information is
                                optional and can be added later. You can
                                complete your profile with just personal
                                information and add company details when you're
                                ready to post jobs.
                              </p>
                            </div>

                            {/* Company Name */}
                            <div>
                              <Label htmlFor="companyName">Company Name</Label>
                              <Field name="companyName">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Enter your company name"
                                    className="mt-1"
                                    icon={<Building2 className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="companyName"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Company Email */}
                            <div>
                              <Label htmlFor="companyEmail">
                                Company Email
                              </Label>
                              <Field name="companyEmail">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter company email address"
                                    className="mt-1"
                                    icon={<Mail className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="companyEmail"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Company Phone */}
                            <div>
                              <Label htmlFor="companyPhone">
                                Company Phone
                              </Label>
                              <Field name="companyPhone">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Enter company phone number"
                                    className="mt-1"
                                    icon={<Phone className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="companyPhone"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Company Address */}
                            <div>
                              <Label htmlFor="companyAddress">
                                Company Address
                              </Label>
                              <Field name="companyAddress">
                                {({ field }) => (
                                  <Textarea
                                    {...field}
                                    placeholder="Enter complete company address"
                                    className="mt-1"
                                    rows={3}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="companyAddress"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Company About */}
                            <div>
                              <Label htmlFor="companyAbout">
                                About Company
                              </Label>
                              <Field name="companyAbout">
                                {({ field }) => (
                                  <Textarea
                                    {...field}
                                    placeholder="Describe your company, its mission, values, and what makes it unique..."
                                    className="mt-1"
                                    rows={4}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="companyAbout"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            {/* Website */}
                            <div>
                              <Label htmlFor="webSite">Company Website</Label>
                              <Field name="webSite">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    type="url"
                                    placeholder="https://www.yourcompany.com"
                                    className="mt-1"
                                    icon={<Globe className="w-4 h-4" />}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="webSite"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          </div>
                        )}

                        {/* Step 2: Company Assets */}
                        {currentStep === 2 && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Company Assets (Optional)
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentStep(4)} // Skip to review
                                className="text-gray-600"
                              >
                                Skip for now
                              </Button>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                              <p className="text-sm text-blue-700">
                                <strong>Optional:</strong> Upload company assets
                                to enhance your profile. These can be added
                                later when you're ready.
                              </p>
                            </div>

                            {/* Company Logo */}
                            <div>
                              <Label>Company Logo</Label>
                              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                {companyLogoPreview ? (
                                  <div className="flex flex-col items-center space-y-3">
                                    <Avatar className="w-20 h-20">
                                      <AvatarImage
                                        src={
                                          companyLogoPreview ||
                                          "/placeholder.svg" ||
                                          "/placeholder.svg"
                                        }
                                        alt="Company Logo"
                                      />
                                      <AvatarFallback>
                                        <Building2 className="w-8 h-8" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm text-green-600">
                                      ✓ {companyLogo?.name} selected
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 mb-2">
                                      Upload your company logo
                                    </p>
                                  </div>
                                )}
                                <p className="text-xs text-gray-500 mb-3">
                                  Supported: JPEG, PNG, GIF, WEBP, BMP, TIFF,
                                  SVG (Max 5MB)
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    companyLogoRef.current?.click()
                                  }
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  {companyLogo ? "Change Logo" : "Choose Logo"}
                                </Button>
                                <input
                                  type="file"
                                  ref={companyLogoRef}
                                  onChange={handleCompanyLogoUpload}
                                  accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                                  className="hidden"
                                />
                              </div>
                            </div>

                            {/* Company Certificate */}
                            <div>
                              <Label>Company Certificate</Label>
                              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  {companyCertificate ? (
                                    <span className="text-green-600">
                                      ✓ {companyCertificate.name} selected
                                    </span>
                                  ) : (
                                    "Upload company registration certificate"
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 mb-3">
                                  Supported: PDF, DOC, DOCX, TXT, RTF (Max 20MB)
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    companyCertificateRef.current?.click()
                                  }
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  {companyCertificate
                                    ? "Change Certificate"
                                    : "Choose Certificate"}
                                </Button>
                                <input
                                  type="file"
                                  ref={companyCertificateRef}
                                  onChange={handleCompanyCertificateUpload}
                                  accept=".pdf,.doc,.docx,.txt,.rtf"
                                  className="hidden"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Social Links */}
                        {currentStep === 3 && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                                Social Media Links (Optional)
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentStep(4)} // Skip to review
                                className="text-gray-600"
                              >
                                Skip for now
                              </Button>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                              <p className="text-sm text-blue-700">
                                <strong>Optional:</strong> Add social media
                                links to help candidates learn more about your
                                company culture and values.
                              </p>
                            </div>

                            {/* Platform Selection */}
                            <div>
                              <Label>Select Social Platforms</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {socialPlatforms.map((platform) => (
                                  <Button
                                    key={platform}
                                    type="button"
                                    variant={
                                      selectedSocialPlatforms.includes(platform)
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      toggleSocialPlatform(platform)
                                    }
                                    className="cursor-pointer"
                                  >
                                    {platform}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Social Links Input Fields */}
                            <div className="space-y-4">
                              {selectedSocialPlatforms.includes("LinkedIn") && (
                                <div>
                                  <Label htmlFor="socialLinks.linkedin">
                                    LinkedIn Profile URL
                                  </Label>
                                  <Field name="socialLinks.linkedin">
                                    {({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="https://linkedin.com/company/yourcompany"
                                        className="mt-1"
                                        icon={<LinkIcon className="w-4 h-4" />}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="socialLinks.linkedin"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                  />
                                </div>
                              )}

                              {selectedSocialPlatforms.includes("Twitter") && (
                                <div>
                                  <Label htmlFor="socialLinks.twitter">
                                    Twitter Profile URL
                                  </Label>
                                  <Field name="socialLinks.twitter">
                                    {({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="https://twitter.com/yourcompany"
                                        className="mt-1"
                                        icon={<LinkIcon className="w-4 h-4" />}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="socialLinks.twitter"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                  />
                                </div>
                              )}

                              {selectedSocialPlatforms.includes("Facebook") && (
                                <div>
                                  <Label htmlFor="socialLinks.facebook">
                                    Facebook Page URL
                                  </Label>
                                  <Field name="socialLinks.facebook">
                                    {({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="https://facebook.com/yourcompany"
                                        className="mt-1"
                                        icon={<LinkIcon className="w-4 h-4" />}
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="socialLinks.facebook"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                  />
                                </div>
                              )}
                            </div>

                            {selectedSocialPlatforms.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>
                                  No social platforms selected. You can skip
                                  this step or add social links later.
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
                                    <strong>Name:</strong> {values.name}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {values.email}
                                  </p>
                                  <p>
                                    <strong>Phone:</strong> {values.phone}
                                  </p>
                                  <p>
                                    <strong>Location:</strong> {values.location}
                                  </p>
                                  {values.about && (
                                    <p>
                                      <strong>About:</strong> {values.about}
                                    </p>
                                  )}
                                  {profileImage && (
                                    <p>
                                      <strong>Profile Image:</strong> ✓{" "}
                                      {profileImage.name}
                                    </p>
                                  )}
                                </div>
                              </Card>

                              {/* Company Info Summary - Only show if data exists */}
                              {(values.companyName ||
                                values.companyEmail ||
                                values.companyPhone ||
                                values.companyAddress ||
                                companyLogo ||
                                companyCertificate) && (
                                <Card className="p-4">
                                  <h4 className="font-medium mb-3">
                                    Company Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    {values.companyName && (
                                      <p>
                                        <strong>Company Name:</strong>{" "}
                                        {values.companyName}
                                      </p>
                                    )}
                                    {values.companyEmail && (
                                      <p>
                                        <strong>Company Email:</strong>{" "}
                                        {values.companyEmail}
                                      </p>
                                    )}
                                    {values.companyPhone && (
                                      <p>
                                        <strong>Company Phone:</strong>{" "}
                                        {values.companyPhone}
                                      </p>
                                    )}
                                    {values.companyAddress && (
                                      <p>
                                        <strong>Address:</strong>{" "}
                                        {values.companyAddress}
                                      </p>
                                    )}
                                    {values.companyAbout && (
                                      <p>
                                        <strong>About Company:</strong>{" "}
                                        {values.companyAbout}
                                      </p>
                                    )}
                                    {values.webSite && (
                                      <p>
                                        <strong>Website:</strong>{" "}
                                        {values.webSite}
                                      </p>
                                    )}
                                    {companyLogo && (
                                      <p>
                                        <strong>Company Logo:</strong> ✓{" "}
                                        {companyLogo.name}
                                      </p>
                                    )}
                                    {companyCertificate && (
                                      <p>
                                        <strong>Company Certificate:</strong> ✓{" "}
                                        {companyCertificate.name}
                                      </p>
                                    )}
                                  </div>
                                </Card>
                              )}

                              {/* Social Links Summary - Only show if links exist */}
                              {(values.socialLinks.linkedin ||
                                values.socialLinks.twitter ||
                                values.socialLinks.facebook) && (
                                <Card className="p-4">
                                  <h4 className="font-medium mb-3">
                                    Social Media Links
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    {values.socialLinks.linkedin && (
                                      <p>
                                        <strong>LinkedIn:</strong>{" "}
                                        {values.socialLinks.linkedin}
                                      </p>
                                    )}
                                    {values.socialLinks.twitter && (
                                      <p>
                                        <strong>Twitter:</strong>{" "}
                                        {values.socialLinks.twitter}
                                      </p>
                                    )}
                                    {values.socialLinks.facebook && (
                                      <p>
                                        <strong>Facebook:</strong>{" "}
                                        {values.socialLinks.facebook}
                                      </p>
                                    )}
                                  </div>
                                </Card>
                              )}

                              {/* Note about optional information */}
                              {!values.companyName && (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <p className="text-sm text-yellow-700">
                                    <strong>Note:</strong> You can complete your
                                    profile now with just personal information
                                    and add company details later when you're
                                    ready to post jobs.
                                  </p>
                                </div>
                              )}
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
                            currentStep === 0 &&
                            (!values.name ||
                              !values.email ||
                              !values.phone ||
                              !values.location)
                          }
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (
                              !values.name ||
                              !values.email ||
                              !values.phone ||
                              !values.location
                            ) {
                              toast.error(
                                "Personal information (name, email, phone, location) is required"
                              );
                              return;
                            }
                            formikHandleSubmit();
                          }}
                          disabled={
                            isSubmitting ||
                            formikSubmitting ||
                            !values.name ||
                            !values.email ||
                            !values.phone ||
                            !values.location
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
