import React from "react";
import { MdPlace } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoBriefcase } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button, Tag } from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  EyeOutlined
} from "@ant-design/icons";
import moment from "moment";

const JobCard = ({ job, handleEdit, handleDelete, handleStatus, layout }) => {
  const navigate = useNavigate();

  // const jobDetailNavigation = () => {
  //   navigate(`/job-details/${job._id}`);
  // };

  return (
    <article
      className={`bg-white shadow-md rounded-lg p-5 space-y-4 transition-all ${
        layout === "list" ? "w-full " : "w-80 mx-auto"
      } `}
      aria-label="Job listing card"
    >
      <div className={`layout === "list` ? "flex items-center  gap-4" : ""}>
        {/* <figure
          className={`${
            layout === "list" ? "w-12 h-12" : "w-10 h-10"
          } bg-black rounded-full flex items-center justify-center`}
          aria-hidden="true"
        >
          <span className="text-white font-bold text-lg">F</span>
        </figure> */}
        {/* Logo Section */}

        {/* Job Info */}
        <div
          className={`${
            layout === "list" ? "w-full flex justify-between gap-4" : ""
          }`}
        >
          <h1 className="text-lg font-semibold text-gray-800">
            {job.jobTitle}
          </h1>
          <p className="text-sm text-gray-500">
            Post on: {moment(job?.createdAt).format("MMMM Do, YYYY")}
          </p>

          {/* Job Details */}
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <IoBriefcase />
            <p>
              {[
                job.experienceRequired[0],
                job.experienceRequired[job.experienceRequired.length - 1],
              ].join(" - ")}{" "}
              yrs
            </p>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <MdPlace />
            <p>{`${job.city}, ${job.country}`}</p>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <FaIndianRupeeSign />
            <p>{job.salaryRange?.join(" - ")}</p>
          </div>

          {/* Status Tag */}
          {/* <Tag
            className={`${layout === "list" ? "flex items-center h-5" : ""}`}
            color={job?.isBlocked ? "red" : "green"}
          >
            {job?.isBlocked ? "Inactive" : "Active"}
          </Tag> */}
          <Button
            type="default"
            // icon={<TeamOutlined />}
            onClick={() => navigate(`/employer/applicants/${job?._id}`)}
            className="flex items-center mt-1"
          >
            Applicants ( {job?.applicantsCount} )
          </Button>
          {/* Actions */}
        </div>

        {/* Actions */}
      </div>
      <footer className="flex space-x-1 justify-end">
        <Button icon={<EditOutlined />} onClick={()=>handleEdit(job)}>
          Edit
        </Button>
        <Button icon={job?.status === "open" ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={()=>handleStatus(job)}>
          {job?.status === "open" ? "Close": "Open"}
        </Button>
        <Button icon={<DeleteOutlined />} onClick={()=>handleDelete(job)} danger>
          Delete
        </Button>
      </footer>
    </article>
  );
};

export default JobCard;
