import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

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

export default function ApplicationConfirmation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-screen-md mx-auto px-4 pt-24 overflow-x-hidden"
    >
      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-2xl mx-auto py-24 px-8"
      >
        <div className="space-y-8 text-center">
          {/* Header Section */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Your Application Has Been
            </h1>
            <p className="text-2xl font-semibold text-primary">Submitted!</p>
          </motion.div>

          {/* Confirmation Messages */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 justify-center text-sm"
            >
              <FaCheckCircle className="h-5 w-5 text-green-500" />
              <p>
                You will get updations at{" "}
                <span className="font-medium">nexgendigital.in@gmail.com</span>
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 justify-center text-sm"
            >
              <FaCheckCircle className="h-5 w-5 text-green-500" />
              <p>
                This employer typically responds to applications within 1 day
              </p>
            </motion.div>
          </motion.div>

          {/* Tracking Section */}
          <motion.div
            variants={itemVariants}
            className="space-y-3 pt-4"
          >
            <h2 className="text-lg font-semibold">
              Keep track of your applications
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You will receive a status update in an email from Techpath within a
              few weeks of submitting your application. In the meantime, you can
              view and track all your applications in the Techpath My jobs section
              at any time.
            </p>
          </motion.div>

          {/* Return Button */}
          <motion.button
            type="button"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-white mt-6 bg-[#000080] hover:bg-[#001F3F] focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-10 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Link to="/all-jobs">Return to job search</Link>
          </motion.button>
        </div>
      </motion.main>
    </motion.div>
  );
}