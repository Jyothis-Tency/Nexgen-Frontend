import React, { useState } from "react";
import CompanyForm from "@/components/Employer/CompanyForm";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const AddorEditCompany = () => {
  const { companyId } = useParams();
  const location = useLocation();
  const [company, setCompany] = useState(location.state?.company || null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="my-6 px-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="container mx-auto px-1 md:px-8 py-2 md:py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl font-bold ml-2">
              {company ? "Edit Company" : "Add Company"}
            </h1>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CompanyForm company={company} />
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default AddorEditCompany;