import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import { useEffect, useRef } from "react";

export default function CompanyDetails() {
  const aboutRef = useRef(null);
  const jobsRef = useRef(null);
  const peopleRef = useRef(null);
  const lifeRef = useRef(null);

  // Scroll to a section when navigation item is clicked
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function getEmployerData() {
      
    }
  }, []);

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Header Section */}
      <Box className="flex flex-row items-start justify-between mb-3 pb-4">
        <Box className="flex items-center justify-left gap-4 mb-4">
          <div className="w-20 h-20 border rounded-full">
            <img
              src="/src/assets/Company-logo.png"
              alt="Company logo"
              className="object-cover w-full h-full"
            />
          </div>
          <Box>
            <Typography variant="h4" className="font-semibold">
              NAVA Company
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Software Development
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Kochi • 1.02K followers • 101-250 employees
            </Typography>
          </Box>
        </Box>
        <Button variant="outlined" color="primary">
          View Website
        </Button>
      </Box>

      {/* Navigation */}
      <Box className="flex gap-6 border-b border-gray-200 mb-8">
        {[
          { label: "About", ref: aboutRef },
          { label: "Jobs", ref: jobsRef },
          { label: "People", ref: peopleRef }, // Navigate to Jobs for "People"
          { label: "Life", ref: lifeRef }, // Add "Life" functionality if needed
        ].map((item) => (
          <Button
            key={item.label}
            onClick={() => scrollToSection(item.ref)}
            className="text-gray-600 min-w-0 px-4 py-2 rounded-none"
            variant="text"
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {/* About Section */}
      <Box className="mb-16 border-b border-gray-200 pb-8" ref={aboutRef}>
        <Typography variant="h5" className="text-gray-400 pb-3 font-semibold">
          About
        </Typography>
        <Typography variant="body1" className="text-black-700 max-w-2xl mb-8">
          NAVA strives to be a knowledge-intensive company centered on data flow
          analysis, process analysis to tracking companies in sustainable
          investing, and long-term thinking. We are driven by the excitement of
          exploring technologies, finding solutions, and developing products
          that change lives. We embrace our work with a sense of responsibility
          and joy.
        </Typography>
      </Box>

      {/* Jobs Section */}
      <Box className="mb-16 border-b border-gray-200 pb-8" ref={jobsRef}>
        <Typography variant="h5" className="text-gray-400 pb-3 font-semibold">
          Jobs
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "UX/UI Designer",
              location: "Seattle, WA",
              type: "Full-time",
              time: "1d",
            },
            {
              title: "Product Designer",
              location: "Remote",
              type: "Full-time",
              time: "3d",
            },
          ].map((job) => (
            <Grid item xs={12} sm={6} key={job.title}>
              <Box className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <Typography
                  variant="h6"
                  className="text-black-400 pb-3 font-semibold"
                >
                  {job.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600 pb-3">
                  {job.location} • {job.type}
                </Typography>
                <Box className="flex flex-row justify-between items-center">
                  <Box className="flex flex-row gap-4">
                    {/* Easy Apply Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      className="mb-5"
                      color="primary"
                      sx={{
                        borderRadius: "16px",
                      }}
                    >
                      Easy Apply
                    </Button>

                    {/* Custom Gray Background Button */}
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(192, 192, 192, 0.49)",
                        padding: "0px 15px ",
                        borderRadius: "16px",
                        "&:hover": {
                          backgroundColor: "rgba(214, 214, 214, 0.85)", // Darker gray on hover
                        },
                      }}
                    >
                      Multiple Candidate
                    </Button>
                  </Box>
                  <Box className="flex ">
                    <Typography className="text-right">{job.time}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* People Section */}
      <Box className="mb-16 border-b border-gray-200 pb-8" ref={peopleRef}>
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h5" className="text-gray-400 pb-3 font-semibold">
            People
          </Typography>

          <Button color="primary" variant="text">
            Show More People
          </Button>
        </Box>
        <Typography variant="h7" className="text-black-400  font-semibold">
          46 employees work here
        </Typography>
        <Box className="flex mt-4">
          {[...Array(6)].map((_, i) => (
            <Avatar
              key={i}
              src={`/src/assets/Candidate.png?height=40&width=40`}
              className="w-10 h-10 -ml-4 bg-blue-500"
              sx={{
                border: "2px solid white",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Life Section */}
      <Box>
        <Box className="flex items-center justify-between mb-6" ref={lifeRef}>
          <Typography variant="h5" className="text-gray-400 pb-3 font-semibold">
            Life
          </Typography>
          <Button color="primary" variant="text">
            Show More Photos
          </Button>
        </Box>
        <Grid container spacing={2}>
          {/* 0th Image - Takes up half the width */}
          <Grid item xs={12} sm={6}>
            <img
              src="/src/assets/companyLife.jpg"
              alt="Company life"
              className="rounded-lg w-full h-full object-cover"
              style={{
                height: "100%", // Ensures it covers the height
                maxHeight: "300px", // Set a reasonable max height
                display: "block",
              }}
            />
          </Grid>

          {/* Remaining Images - Grid on the other half */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              {[1, 2, 3].map((_, i) => (
                <Grid item xs={6} key={i}>
                  <img
                    src="/src/assets/companyLife.jpg"
                    alt={`Company life ${i}`}
                    className="rounded-lg w-full h-full object-cover"
                    style={{
                      height: "100px", // Set a specific height for grid images
                      objectFit: "cover",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
