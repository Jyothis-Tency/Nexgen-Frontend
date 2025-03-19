import { useEffect, useState } from "react";
import ListTable from "../common/ListTable";
import { Button } from "antd";
import { toast } from "sonner";
import { FaRegEye } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getAllEmployerVerification,
  employerVerificationChangeStatus,
} from "@/apiServices/adminApi";

const EmployerVerification = () => {
  const [verificationAppli, setVerificationAppli] = useState([]);

  const [applicationStatus, setApplicationStatus] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchVerificationAppli(currentPage);
  }, [currentPage]);

  async function fetchVerificationAppli(page) {
    try {
      const result = await getAllEmployerVerification(page, rowsPerPage);
      console.log("Reeeesss", result);
      if (result?.data?.response) {
        const { EmployerApplications, totalPages } = result.data.response;
        setVerificationAppli(EmployerApplications);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log("Error in user listing component: ", error.message);
      toast.error("An unexpected error occured");
    }
  }

  const columns = [
    { key: "ownerName", label: "Owner Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "documents", label: "Documents" },
    { key: "action", label: "" },
  ];

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleViewDocs = () => {};

  const handleAction = (applicationId, decision)=>{
    setIsDecisionDialogOpen(true);
    setApplicationId(applicationId)
    setApplicationStatus(decision)
  }

  const handleVerificatonDecision = async (applicationId, decision) => {
    try {
      console.log("Response before changing status: ", applicationId, decision);
      const result = await employerVerificationChangeStatus(
        applicationId,
        decision
      );
      console.log("Response after changing status: ", result, decision);
      if (result?.data?.response) {
        const { message, response } = result.data;
        toast.success(message);
        setVerificationAppli((prev) =>
          prev.filter((item) => item._id !== response._id)
        );
      }
    } catch (error) {
      console.log(
        "Error in handle employer verification at user listing: ",
        error
      );
      toast.error("An unexpected error occured");
    }finally{
      setIsDecisionDialogOpen(false)
    }
  };

  const tableData = verificationAppli.map((item) => ({
    ...item,
    ownerName: item.ownerName,
    company: item.name,
    //  status: item.isBlocked
    //         ? <span className='text-red-500'>blocked</span>
    //         : <span className='text-green-500'>active</span>,
    documents: (
      <>
        <Button
          className="font-semibold"
          onClick={() => handleViewDocs(item._id)}
        >
          <FaRegEye />
          View
        </Button>
      </>
    ),
    action: (
      <>
        <Button
          color="primary"
          variant="outlined"
          className="font-semibold mr-1"
          onClick={() => handleAction(item?._id, "Verified")}
        >
          Accept
        </Button>

        <Button
          danger
          className="font-semibold"
          onClick={() => handleAction(item?._id, "Rejected")}
        >
          Reject
        </Button>
      </>
    ),
  }));

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold mb-4">Verification Forms</h1>
        <ListTable
          columns={columns}
          data={tableData}
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>

      <Dialog
        open={isDecisionDialogOpen}
        onOpenChange={setIsDecisionDialogOpen}
      >
        <DialogContent className="w-[1000px] ">
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {applicationStatus === "Verified" ? (
              <p>
                Are you sure you want to verify this application? This action
                cannot be undone.
              </p>
            ) : (
              <p>
                Are you sure you want to reject this application? This action cannot be
                undone.
              </p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDecisionDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerificatonDecision(applicationId, applicationStatus)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployerVerification;
