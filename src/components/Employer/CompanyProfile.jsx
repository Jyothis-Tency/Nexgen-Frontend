import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LanguageIcon from "@mui/icons-material/Language";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import EditCompanyModal from "./EditCompanyModal";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const CompanyProfile = ({
  companies,
  openModal,
  closeModal,
  modalState,
  selectedComp,
  setSelectedComp,
}) => {
  const navigate = useNavigate();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenAboutModal = (about) => {
    setAboutText(about);
    setAboutModalOpen(true);
  };

  const handleCloseAboutModal = () => {
    setAboutModalOpen(false);
    setAboutText("");
  };

  const handleEditClick = (company) => {
    navigate(`/employer/addCompany/${company._id}`, { state: { company } });
  };

  const handleSaveCompany = async (updatedEmp) => {
    try {
      const resultAction = await dispatch(updateEmployer(updatedEmp));
      if (updateEmployer.fulfilled.match(resultAction)) {
        console.log("Profile updated successfully:", resultAction.payload);
        closeModal("editProfile"); // Close modal on success
      } else {
        console.error("Profile update failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.2 },
    }),
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.2, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  const avatarVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 0.8, y: 0, transition: { duration: 0.2 } },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  const InfoItem = ({ icon, label, children }) => (
    <Box display="flex" alignItems="center">
      <Box mr={1} color="text.secondary">
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        <strong>{label}:</strong> {children}
      </Typography>
    </Box>
  );

  const AnimatedIconLink = ({ href, icon }) => (
    <motion.div
      variants={iconVariants}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover="hover"
      whileTap="tap"
    >
      <MuiLink href={href} target="_blank" rel="noopener noreferrer">
        {icon}
      </MuiLink>
    </motion.div>
  );

  return (
    <>
      <Box>
        <AnimatePresence>
          {companies.map((company, index) => (
            <motion.div
              key={company._id}
              className="mb-6"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                gap={3}
                p={2}
                bgcolor="white"
                boxShadow={2}
                borderRadius={2}
                overflow="hidden"
              >
                {/* Logo */}
                <Box position="relative" alignSelf="center">
                  <motion.div
                    variants={avatarVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <MuiLink
                      href={company.webSite || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Avatar
                        src={company.logo || "/src/assets/Company-logo.png"}
                        sx={{
                          width: { xs: 80, sm: 100 },
                          height: { xs: 80, sm: 100 },
                          border: "4px solid white",
                        }}
                      />
                      <motion.span
                        className="whitespace-nowrap absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded"
                        variants={tooltipVariants}
                        initial="hidden"
                        animate="hidden"
                        whileHover="visible"
                      >
                        Visit Website
                      </motion.span>
                    </MuiLink>
                  </motion.div>
                </Box>

                {/* Details */}
                <Box flex={1}>
                  {/* Header */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="h6" color="text.primary">
                      {company.companyName}
                    </Typography>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <IconButton onClick={() => handleEditClick(company)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </motion.div>
                  </Box>

                  {/* Info */}
                  <Stack spacing={1.2} mt={2}>
                    <InfoItem icon={<LanguageIcon />} label="Website">
                      <MuiLink href={company.webSite || "#"} color="primary">
                        {company.webSite || "Not specified"}
                      </MuiLink>
                    </InfoItem>
                    <InfoItem icon={<BusinessIcon />} label="Email">
                      {company.email || "Not specified"}
                    </InfoItem>
                    <InfoItem icon={<BusinessIcon />} label="Phone">
                      {company.phone || "Not specified"}
                    </InfoItem>
                    <InfoItem icon={<InfoIcon />} label="About">
                      {isMobile ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleOpenAboutModal(
                              company.about || "Not available"
                            )
                          }
                        >
                          {company.about || "Not available"}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {company.about || "Not available"}
                        </Typography>
                      )}
                    </InfoItem>

                    <InfoItem icon={<HomeIcon />} label="Address">
                      {company.address || "Not available"}
                    </InfoItem>
                  </Stack>

                  {/* Social Links */}
                  <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                    <AnimatePresence>
                      {company.socialLinks?.linkedin && (
                        <AnimatedIconLink
                          href={company.socialLinks.linkedin}
                          icon={<LinkedInIcon />}
                        />
                      )}
                      {company.socialLinks?.twitter && (
                        <AnimatedIconLink
                          href={company.socialLinks.twitter}
                          icon={<TwitterIcon />}
                        />
                      )}
                      {company.socialLinks?.facebook && (
                        <AnimatedIconLink
                          href={company.socialLinks.facebook}
                          icon={<FacebookIcon />}
                        />
                      )}
                    </AnimatePresence>
                  </Stack>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      <Dialog
        open={aboutModalOpen}
        onClose={handleCloseAboutModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>About Company</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {aboutText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAboutModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Animation variants for stack items
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default CompanyProfile;
