import React, { useState, useEffect } from "react";
import ListingTable from "../../../components/common/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateJobForm from "@/components/Employer/CreateJobForm";
import Switch from "@mui/material/Switch";
import { useNavigate, useParams } from "react-router-dom";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { toast } from "sonner";
import ApplicantModal from "@/components/Employer/ApplicantModal";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const dummyColumns = (handleActiveToggle, isSmallScreen) => {
  const baseColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ];

  if (!isSmallScreen) {
    baseColumns.push({ key: "location", label: "Location" });
  }

  baseColumns.push({
    key: "status",
    label: "Status",
    render: (status, row) => (
      <motion.span
        className={`py-1 rounded font-bold ${
          status === "Shortlisted"
            ? "text-green-500"
            : status === "Pending"
            ? "text-orange-400"
            : "text-red-500"
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {status}
      </motion.span>
    ),
  });

  return baseColumns;
};

function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await employerAxiosInstance.get(
        `/job-applications/${jobId}`
      );
      console.log(data, "ress");
      setApplications(data.jobApplications);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load applicants");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleView = (id) => {
    const application = applications.find((app) => app._id === id);
    navigate("/employer/applicants/application", { state: { application } });
  };

  const handleActiveToggle = (id) => {
    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === id
          ? { ...application, active: !application.active }
          : application
      )
    );
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedData(null);
  };

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="my-6 px-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-2xl font-bold" variants={itemVariants}>
        Job Applicants
      </motion.h1>
      <motion.div variants={itemVariants}>
        {loading ? (
          <motion.div
            className="flex justify-center items-center h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 text-lg">Loading...</p>
          </motion.div>
        ) : (
          <ListingTable
            users={applications}
            columns={dummyColumns(handleActiveToggle, isSmallScreen)}
            rowsPerPage={5}
            onView={handleView}
          />
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ApplicantModal
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              application={selectedData}
              setSelectedData={setSelectedData}
              fetchApplications={fetchApplications}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Applicants;
