import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ListingTable = ({ users, columns, rowsPerPage = 5, onView }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((user) => user.id)));
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const UserRow = ({ user }) => (
    <tr>
      {columns.map(({ key, label, render }) => (
        <td key={key} className="p-1 py-2 md:p-4 text-sm text-black text-left">
          {key === "status" ? (
            <div className="flex flex-col gap-1">
              {render ? render(user[key], user) : user[key]}
              {isSmallScreen && (
                <button
                  className="mt-1 text-blue-600 text-sm flex items-center gap-1"
                  title="View"
                  onClick={() => onView(user._id)}
                >
                  <FaEye />
                  View
                </button>
              )}
            </div>
          ) : key === "email" ? (
            // Email column with location below on small screens
            <div className="flex flex-col gap-1">
              {render ? render(user[key], user) : user[key]}
              {isSmallScreen && user.location && (
                <p className="text-xs text-gray-500">Location: {user.location}</p>
              )}
            </div>
          ) : render ? (
            render(user[key], user)
          ) : (
            user[key]
          )}
        </td>
      ))}

      {!isSmallScreen && (
        <td className="flex justify-end items-center p-4">
          <button
            className="mr-4"
            title="View"
            onClick={() => onView(user._id)}
          >
            <FaEye />
          </button>
        </td>
      )}
    </tr>
  );

  const Pagination = () => {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="md:flex m-4">
        <p className="text-sm text-gray-500 flex-1">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, users.length)} of {users.length}{" "}
          entries
        </p>
        <div className="flex items-center max-md:mt-4">
          <p className="text-sm text-gray-500">Display</p>
          <select
            className="text-sm text-gray-500 border border-gray-400 rounded h-7 mx-4 px-1 outline-none"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <ul className="flex space-x-1 ml-2">
            <li
              className="flex items-center justify-center cursor-pointer bg-blue-100 w-7 h-7 rounded"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              {<MdOutlineKeyboardArrowLeft />}
            </li>
            {pages.map((page) => (
              <li
                key={page}
                className={`flex items-center justify-center cursor-pointer text-sm w-7 h-7 rounded ${
                  currentPage === page
                    ? "bg-[#007bff] text-white"
                    : "text-gray-500"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </li>
            ))}
            <li
              className="flex items-center justify-center cursor-pointer bg-blue-100 w-7 h-7 rounded"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              {<MdOutlineKeyboardArrowRight />}
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="whitespace-nowrap">
            <tr>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  className="p-1 md:p-4 text-left text-sm font-semibold text-black"
                >
                  {label}
                </th>
              ))}
              {!isSmallScreen && (
                <th className="p-4 text-right text-sm font-semibold text-black">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="whitespace-nowrap">
            {users
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </div>
  );
};

export default ListingTable;
