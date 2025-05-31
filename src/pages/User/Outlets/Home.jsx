"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  People,
  BarChart,
  Star,
  CheckCircleOutline,
} from "@mui/icons-material";
import JobCard from "@/components/User/JobCard";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { motion } from "framer-motion";
import bannerImg from "/Images/bannerImg.jpg";
import employerImg from "/Images/employer-img.jpg";
import repairImg from "/Images/mob-repair-img1.jpg";
import { useSelector } from "react-redux";
import seekerImg from "/Images/cv.png";
import businessmanImg from "/Images/businessman-blue.png";
import AdBannerCarousel from "@/components/User/adBanner";
import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";
// import { SuperBallLoader } from "@/components/loader";

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

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.seekerInfo);
  const [adBanners, setAdBanners] = useState([]);
  const navigate = useNavigate();

  // Fetch ad banners from the same endpoint used in banner-admin
  const fetchAdBanners = async () => {
    try {
      const { data } = await adminAxiosInstance.get("/all-banners");
      // The response structure is { message, data } where data contains the banner array
      if (data && data.data) {
        // Map the backend data structure to match what AdBannerCarousel expects
        const mappedBanners = data.data
          .filter((banner) => banner.active) // Only show active banners
          .map((banner) => ({
            id: banner._id,
            imageUrl: banner.image, // This is the signed URL from S3
            link: banner.link || "#", // Default to "#" if no link is provided
            altText: banner.fileName || "Advertisement Banner",
          }));
        setAdBanners(mappedBanners);
        console.log("Banners loaded:", mappedBanners.length);
      } else {
        setAdBanners([]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      // Fallback to empty array if fetch fails
      setAdBanners([]);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      const query = searchTerm.trim();
      if (query) {
        navigate("/all-jobs", {
          state: {
            searchInput: query,
          },
        });
      }
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await userAxiosInstance.get("/getJobPosts");
      console.log('====>',data.jobPosts);
      if(data?.jobPosts) {
        setJobs(data.jobPosts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAdBanners(); // Fetch ad banners when component mounts
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <main className="flex-grow">
        {/* Hero Banner Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full h-[600px] sm:h-[600px] md:h-[700px] lg:h-[700px] flex items-center justify-center"
        >
          <img
            src={bannerImg || "/placeholder.svg"}
            alt="Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pt-16 sm:pt-20 md:pt-24 px-4 sm:px-8 md:px-16 lg:px-20 text-white"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
              Find Your Dream Job Today
            </h1>
            <p className="mt-2 text-sm sm:text-md md:text-lg max-w-2xl font-marcellus">
              Whether you're a skilled technician or just starting out, our
              platform is designed to match you with job opportunities tailored
              to your expertise.
            </p>

            {/* Search box */}
            <div className="mt-4 w-full max-w-xl flex items-center gap-2">
              <input
                type="text"
                placeholder="Search jobs by title, keyword, or location"
                className="w-full py-3 px-5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {Object.keys(user).length < 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-6 mt-20 sm:mt-20 w-full max-w-md"
              >
                <Link to="/sign-up" className="w-full">
                  <div className="flex items-center justify-between w-full rounded-lg
                    py-4 px-6 border-1 border-gray-100 text-white bg-blue-500 transform transition-transform hover:scale-105">
                    <div className="mx-auto text-center">
                      <span className="text-lg font-semibold">I want a job</span>
                      {/* <div className="text-lg font-semibold">I want a job</div> */}
                    </div>
                    <img
                      src={seekerImg || "/placeholder.svg"}
                      alt="img"
                      className="w-12 h-12"
                    />
                  </div>
                </Link>

                <Link to="/employer/register" className="w-full">
                  <div className="flex items-center justify-between w-full rounded-lg
                    py-4 px-4 border-1 border-blue-500 bg-gray-100 text-blue-500 transform transition-transform hover:scale-105">
                    <div className="mx-auto text-center">
                      <span className="text-lg font-semibold">I want to hire</span>
                      {/* <div className="text-lg font-semibold">I want to hire</div> */}
                    </div>
                    <img
                      src={businessmanImg || "/placeholder.svg"}
                      alt="businessImg"
                      className="w-12 h-12"
                    />
                  </div>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Ad Banner Section - only renders if banners exist */}
        {adBanners.length > 0 && (
          <AdBannerCarousel banners={adBanners} autoSlideInterval={5000} />
        )}

        {/* Jobs Recommended Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16 bg-gray-100"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-primary text-center px-4">
            Jobs Recommended for You
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container mx-auto max-w-screen-xl mt-6 sm:mt-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-5">
              {jobs?.map((job, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <JobCard job={job} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="mt-8 text-center">
            <Link to="/all-jobs">
              <button
                className="px-6 py-2 bg-white border border-blue-500 text-blue-500 shadow-md rounded-lg
                hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Browse All Jobs
              </button>
            </Link>
          </div>
        </motion.div>

        {/* For Job Seekers Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 sm:px-8 lg:px-16">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                For Job Seekers
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6">
                Discover your next career move with our extensive job listings
                and personalized recommendations.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Access thousands of job listings",
                  "Create a standout profile",
                  "Get personalized job recommendations",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleOutline className="text-green-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/all-jobs">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Find Jobs
                </button>
              </Link>
            </div>
            <div className="order-1 md:order-2 mb-4 md:mb-0">
              <img
                src={repairImg || "/placeholder.svg"}
                alt="Job seeker using laptop"
                className="rounded-xl shadow-xl w-full h-48 sm:h-64 object-cover
                          transition-transform ease-in-out transform hover:scale-105 duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* For Employers Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 sm:px-8 lg:px-16">
            <div className="mb-4 md:mb-0">
              <img
                src={employerImg || "/placeholder.svg"}
                alt="Employer posting a job"
                className="rounded-xl shadow-xl w-full h-48 sm:h-64 object-cover
                          transition-transform ease-in-out transform hover:scale-105 duration-300"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                For Employers
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6">
                Find the perfect candidates quickly and efficiently with our
                advanced recruiting tools.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Post jobs and manage applications",
                  "Search our extensive candidate database",
                  "Use AI-powered matching technology",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleOutline className="text-green-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/employer/register">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Post a Job
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16 bg-white"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">
              What Our Users Say
            </h2>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-8 lg:px-16"
          >
            {[
              {
                text: "JobConnect helped me find my dream job in just two weeks. The platform is user kinematic-friendly and the job recommendations were spot-on!",
                author: "Sarah T. - Software Developer",
              },
              {
                text: "As an employer, I've been impressed with the quality of candidates we've found through JobConnect. It's streamlined our hiring process significantly.",
                author: "Mark R. - HR Manager",
              },
              {
                text: "The AI-powered matching on JobConnect is a game-changer. I've never had such relevant job recommendations before!",
                author: "Emily L. - Marketing Specialist",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">
                  {testimonial.author}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-12 md:py-16 bg-gray-50"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Why Choose JobConnect
            </h2>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-8 lg:px-16"
          >
            {[
              {
                icon: <People className="text-blue-500 text-4xl" />,
                title: "Large Talent Pool",
                description:
                  "Access thousands of qualified candidates or job listings.",
              },
              {
                icon: <BarChart className="text-blue-500 text-4xl" />,
                title: "Advanced Matching",
                description:
                  "Our AI-powered system ensures perfect job-candidate fits.",
              },
              {
                icon: <Star className="text-blue-500 text-4xl" />,
                title: "Top Companies",
                description: "Partner with industry-leading organizations.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-white border rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-6 bg-gray-200"
      >
        <div className="container mx-auto px-4">
          <p className="text-gray-600 text-sm text-center mb-2">
            © 2024 JobConnect. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="text-blue-600 hover:underline text-sm">
              Terms of Service
            </button>
            <button className="text-blue-600 hover:underline text-sm">
              Privacy
            </button>
          </div>
        </div>
      </motion.footer>
    </>
  );
}
