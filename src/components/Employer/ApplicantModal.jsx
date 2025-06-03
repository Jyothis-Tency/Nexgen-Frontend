import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FaUser, FaPhone } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Button } from "@mui/material";
import { toast } from "sonner";
import useRequestUser from "@/hooks/useRequestUser";
import { useLocation, useNavigate } from "react-router-dom";

function ApplicantPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const application = state?.application;
  console.log("APPLICAT", application);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const { sendRequest } = useRequestUser();

  const handleDecision = async (applicationId) => {
    if (!applicationStatus) {
      toast.error("Please select a status option.");
      return;
    }

    const applicationStatusData = { applicationStatus };

    toast.promise(
      new Promise((resolve, reject) => {
        sendRequest({
          url: `/employer/job-applications/${applicationId}/update_status`,
          method: "POST",
          data: applicationStatusData,
          onSuccess: (data) => {
            application.status = applicationStatus;
            setIsDecisionDialogOpen(false);
            resolve(data);
          },
          onError: (err) => {
            reject(err);
          },
        });
      }),
      {
        loading: "Updating status...",
        success: "Status updated successfully!",
        error: "Failed to update status.",
      }
    );
  };

  if (!application) {
    return (
      <div className="p-4">
        <p className="text-red-500">No application data found.</p>
        <button
          className="text-blue-500 underline mt-4"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline w-fit"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Application Details</h1>
        <div/>
      </div>

      {/* Status and Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <p className="text-xl font-semibold">
            Status:{" "}
            <span
              className={
                application.status === "Shortlisted"
                  ? "text-green-500"
                  : application.status === "Rejected"
                  ? "text-red-500"
                  : "text-orange-500"
              }
            >
              {application.status}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={applicationStatus}
            onChange={(e) => setApplicationStatus(e.target.value)}
          >
            <option value="">Change Status</option>
            <option value="Shortlisted">Shortlist</option>
            <option value="Rejected">Reject</option>
            <option value="Pending">Pending</option>
          </select>
          <Button
            variant="contained"
            onClick={() => {
              if (applicationStatus) setIsDecisionDialogOpen(true);
              else toast.error("Please select status option");
            }}
          >
            Change Status
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <FaUser className="text-muted-foreground" />
              <span className="font-medium">Name:</span>
              <span>{application.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <span>{application.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <IoMail className="text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{application.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLocationDot className="text-muted-foreground" />
              <span className="font-medium">Location:</span>
              <span>{application.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {application.resume && (
              <div className="flex flex-col gap-1">
                <span className="font-medium">Resume</span>
                <span className="text-muted-foreground">
                  {application.resume}
                </span>
              </div>
            )}
            {application.resume && (
              <div className="flex flex-col gap-1">
                <span className="font-medium">Additional File</span>
                <span className="text-muted-foreground">
                  {application.resume}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cover Letter */}
        {application.coverLetter && (
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap border bg-gray-100 p-4 rounded-md text-sm">
                {application.coverLetter}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirm Status Change Prompt */}
      {isDecisionDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-md md:w-[1000px] w-[350px] ">
            <h2 className="text-lg font-semibold mb-4">Confirm Status</h2>
            <p className="mb-6">
              Are you sure you want to change the status to{" "}
              <span className="font-semibold">{applicationStatus}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDecisionDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision(application._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantPage;
