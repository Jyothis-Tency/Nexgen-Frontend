import React, { useEffect, useState } from "react";
import {
  Search,
  People,
  BarChart,
  Star,
  CheckCircleOutline,
} from "@mui/icons-material";
// import NavbarHome from "../components/User/NavbarHome";
import JobCard from "@/components/Employer/JobCard";
import axios from "axios";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { Button, Input } from "@mui/material";
import ImageSiderComponent from "@/components/common/image-sliderComponent";
import Navbar from "@/components/User/Navbar";
import { Link } from "react-router-dom";

// import {banner1} from "../../public/Images/banner1"

const images = [
  {
    url: "../../public/Images/banner-home2.webp",
    alt: "Slide 1",
  },
  {
    url: "../../public/Images/banner-home2.webp",
    alt: "Slide 2",
  },
  {
    url: "../../public/Images/banner-home2.webp",
    alt: "Slide 3",
  },
  {
    url: "../../public/Images/banner-home2.webp",
    alt: "Slide 4",
  },
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const fetchJobs = async () => {
    try {
      const { data } = await userAxiosInstance.get("/getJobPosts");
      console.log(data.jobPosts);
      setJobs(data.jobPosts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);
  // const jobs = Array(8).fill({});

  return (
    <>
      <main className="flex-grow">
        {/* h-[100vh] */}
        <div className="">
          {/* <ImageSiderComponent images={images} /> */}

          <div className=" bg-blue-900 text-white  px-20 py-28 flex items-center">
            <div className="flex flex-col items-center container mx-auto  space-y-10 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Dream Job Today
              </h1>
              <p className="mb-8 text-blue-100">
                Whether you're a skilled technician or just starting out, our
                platform is designed to match you with job opportunities
                tailored to your expertise. Explore openings, apply with ease,
                and secure your dream job today!
              </p>

              {/* <div className="md:space-y-4 lg:space-y-8 mb-0 "> */}
              {/* <h1 className="leading-tight text-white font-bold text-3xl  lg:text-6xl font-serif">
                Find Your
                <br />
                Dream Job Today
              </h1>
              <p className="lg:text-lg text-gray-600">
                Whether you're a skilled technician or just starting out, our
                platform is designed to match you with job opportunities
                tailored to your expertise. Explore openings, apply with ease,
                and secure your dream job today!
              </p> */}

              {/* <div className="flex max-w-md gap-2 rounded-lg bg-white mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Job, Location"
                      className="pl-10 w-full py-3"
                    />
                  </div>
                  <Button
                    variant="contained"
                    className="bg-primary hover:bg-secondary hover:text-primary w-40"
                  >
                    Search
                  </Button>
                </div> */}

              <div className="flex items-start gap-8">
                <Link to="/sign-up">
                  <div className="rounded-xl bg-blue-500 p-5 px-9 transform transition-transform hover:scale-105 hover:cursor-pointer">
                    <div className="text-sm">Register as</div>
                    <div className="lg:text-2xl font-semibold">Job Seeker</div>
                  </div>
                </Link>

                <Link to="employer/register">
                  <div className="rounded-xl bg-blue-500 p-5 px-9 transform transition-transform hover:scale-105 hover:cursor-pointer">
                    <div className="text-sm">Register as</div>
                    <div className="lg:text-2xl font-semibold">Employer</div>
                  </div>
                </Link>
                {/* <div className="space-y-2">
                    <h3 className="lg:text-xl font-semibold">
                      Unlocking your potential
                    </h3>
                    <p className="text-base text-gray-600">
                      Here to help with new oppertunities
                    </p>
                    <a href="#" className="text-primary hover:underline">
                      Browse All Jobs →
                    </a>
                  </div> */}
              </div>
              {/* </div> */}

              {/* Search Form */}
              {/* <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
                <div className="flex-1 flex items-center px-4 border rounded">
                  <input
                    type="text"
                    placeholder="Job Title or keywords"
                    className="w-full py-2 text-gray-800 focus:outline-none"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 border rounded">
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full py-2 text-gray-800 focus:outline-none"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 border rounded">
                  <select className="w-full py-2 text-gray-800 focus:outline-none">
                    <option>All Categories</option>
                  </select>
                </div>
                <button className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600">
                  Find Jobs
                </button>
              </div> */}

              {/* Stats */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="text-3xl font-bold">674,058</div>
                  <div className="text-blue-100">Active Workers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">74,587</div>
                  <div className="text-blue-100">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">48</div>
                  <div className="text-blue-100">Countries</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* <ImageSiderComponent images={images}/> */}

        {/* <div className="relative bg-gray-100 lg:h-[800px] flex flex-col justify-center items-center overflow-hidden">
          <img
            src="../../public/Images/banner-home2.webp"
            alt=""
            className="object-cover w-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bg-blue-700 opacity-35 w-full h-full"></div>
         
          <div className="absolute container lg:mb-10 md:px-10 lg:px-20 mx-auto grid md:grid-cols-2 gap-8 lg:py-12 md:mt-20 ">
            <div className="md:space-y-4 lg:space-y-8 mb-0 ">
              <h1 className="leading-tight text-white font-bold text-3xl  lg:text-6xl font-serif">
                Find Your
                <br />
                Dream Job Today
              </h1>
              <p className="lg:text-lg text-gray-600">
                Whether you're a skilled technician or just starting out, our
                platform is designed to match you with job opportunities
                tailored to your expertise. Explore openings, apply with ease,
                and secure your dream job today!
              </p>

            
              <div className="flex max-w-md gap-2 rounded-lg bg-white">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Job, Location"
                    className="pl-10 w-full py-3"
                  />
                </div>
                <Button
                  variant="contained"
                  className="bg-primary hover:bg-secondary hover:text-primary w-40"
                >
                  Search
                </Button>
              </div>

             
              <div className="flex items-start gap-8">
                <div className="rounded-xl bg-purple-100 p-5 px-9 transform transition-transform hover:scale-105 hover:cursor-pointer">
                  <div className="text-sm">Register as</div>
                  <div className="lg:text-2xl font-semibold">Employer</div>
                </div>
                <div className="space-y-2">
                  <h3 className="lg:text-xl font-semibold">
                    Unlocking your potential
                  </h3>
                  <p className="text-base text-gray-600">
                    Here to help with new oppertunities
                  </p>
                  <a href="#" className="text-primary hover:underline">
                    Browse All Jobs →
                  </a>
                </div>
              </div>
            </div> */}

        {/* <div className="relative"> */}
        {/* Job Alert */}
        {/* <div className="absolute left-0 top-1 z-10 rounded-lg bg-white p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👋</span>
                  <span>Job Alert Subscribe</span>
                </div>
              </div> */}

        {/* Main Image */}
        {/* <div className="relative h-[px] lg:h-[400px] overflow-hidden rounded-lg">
                <img
                  src="../../public/Images/banner1.jpg"
                  alt="Professional at work"
                  fill
                  className="object-cover"
                />
              </div> */}

        {/* Talent Search Form */}
        {/* <div className="absolute -right-4 top-4 z-10 w-72 rounded-lg bg-white p-4 shadow-lg">
              <div className="space-y-4">
                <Input placeholder="Type of Work" />
                <Input placeholder="Position" />
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Search Talent
                </Button>
              </div>
            </div> */}

        {/* Candidates Card */}
        {/* <div className="absolute bottom-16 left-0 z-10 rounded-lg bg-white p-4 shadow-lg">
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  5k+ candidates get job
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white"
                    />
                  ))}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    +
                  </div>
                </div>
              </div>
            </div> */}
        {/* </div> */}
        {/* </div>
        </div> */}

        {/* Brands */}
        {/* <div className="border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap items-center justify-center gap-12 grayscale">
              {["aws", "walmart", "hbo", "vanguard", "time", "levis"].map(
                (brand) => (
                  <div
                    key={brand}
                    className="h-8 w-24 bg-contain bg-center bg-no-repeat opacity-50"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=32&width=96)`,
                    }}
                  />
                )
              )}
            </div>
          </div>
        </div> */}

        {/* Job Cards Section */}
        {/* Job Cards Section */}
        <div className="py-16 bg-gray-50">
          <h2 className="text-2xl font-bold text-primary px-4 lg:px-10 text-center">
            Jobs Recommended for You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 lg:px-10 mt-6">
            {jobs.map((jobs, index) => (
              <JobCard
                key={index}
                title={jobs?.jobTitle}
                location={jobs?.city}
                salary={jobs?.salaryRange}
                date={jobs?.createdAt}
                id={jobs?._id}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Browse All Jobs
            </button>
          </div>
        </div>

        {/* For Job Seekers Section */}
        <div className="py-16 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:px-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">For Job Seekers</h2>
              <p className="text-gray-700 mb-6">
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
                    <CheckCircleOutline className="text-green-500 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Find Jobs
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60"
                alt="Job seeker using laptop"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>

        {/* For Employers Section */}
        <div className="py-16 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:px-16">
            <div>
              <img
                src="https://plus.unsplash.com/premium_photo-1661658740167-45b56833412b?w=500&auto=format&fit=crop&q=60"
                alt="Employer posting a job"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">For Employers</h2>
              <p className="text-gray-700 mb-6">
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
                    <CheckCircleOutline className="text-green-500 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Post a Job
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-16">
            {[
              {
                text: "JobConnect helped me find my dream job in just two weeks. The platform is user-friendly and the job recommendations were spot-on!",
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
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Why Choose JobConnect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-16">
            {[
              {
                icon: <People className="text-blue-500" />,
                title: "Large Talent Pool",
                description:
                  "Access thousands of qualified candidates or job listings.",
              },
              {
                icon: <BarChart className="text-blue-500" />,
                title: "Advanced Matching",
                description:
                  "Our AI-powered system ensures perfect job-candidate fits.",
              },
              {
                icon: <Star className="text-blue-500" />,
                title: "Top Companies",
                description: "Partner with industry-leading organizations.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white border rounded-lg text-center"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 bg-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          © 2024 JobConnect. All rights reserved.
        </p>
        <div className="space-x-4">
          <button className="text-blue-600 hover:underline">
            Terms of Service
          </button>
          <button className="text-blue-600 hover:underline">Privacy</button>
        </div>
      </footer>
    </>
  );
}
