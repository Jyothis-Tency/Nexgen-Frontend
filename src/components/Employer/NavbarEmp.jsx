import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarEmp = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const toggleSubmenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`bg-white shadow-lg h-screen fixed top-0 left-0 overflow-auto z-10 transition-all duration-500 flex flex-col ${
          isSidebarOpen
            ? "w-[250px] opacity-100"
            : "w-0 opacity-0 lg:w-[250px] lg:opacity-100"
        }`}
      >
        {/* Sidebar Items */}
        <div className="flex justify-center px-4 py-4 bg-white shadow-md min-h-[64px] z-20 sticky top-0">
          <h1 className="text-3xl font-bold text-primary">Techpath</h1>
        </div>

        <div className="py-4 px-4 flex-1">
          <ul className="space-y-2">
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                url: "/employer/dashboard",
              },
              {
                id: "jobs",
                label: "Jobs",
                subItems: [
                  { label: "Create Job", url: "/employer/create_job" },
                  { label: "Jobs", url: "/employer/job_list" },
                ],
              },
              {
                id: "company_details",
                label: "Company Details",
                url: "/employer/company_details",
              },
              {
                id: "add_company",
                label: "Add Company",
                url: "/employer/addcompany",
              },
              {
                id: "home",
                label: "Move to home page",
                url: "/",
              }
              // { id: "actions", label: "Actions", icon: "plus" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() =>
                    item.url ? navigate(item.url) : toggleSubmenu(item.id)
                  }
                  className="w-full text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300"
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.label}
                  </span>
                  {item.subItems && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-3 fill-current ml-auto transition-transform duration-500 ${
                        openMenus[item.id] ? "rotate-0" : "-rotate-90"
                      }`}
                      viewBox="0 0 451.847 451.847"
                    >
                      <path d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z" />
                    </svg>
                  )}
                </button>
                {item.subItems && (
                  <ul
                    className={`ml-8 space-y-2 overflow-hidden transition-all duration-500 ${
                      openMenus[item.id] ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    {item.subItems.map((subItem, index) => (
                      <li key={index}>
                        <Link
                          to={subItem.url}
                          className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300"
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 w-full ">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="lg:hidden top-4 left-4 bg-white p-2 rounded-full shadow-md z-50"
        >
          <svg
            className="w-7 h-7"
            fill="#000"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </>
  );
};

export default NavbarEmp;
