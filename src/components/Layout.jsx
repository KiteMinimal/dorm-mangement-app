import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 right-4 z-30 bg-white border border-gray-300 shadow-md p-2 rounded-full hover:bg-gray-100 transition"
      >
        {sidebarOpen ? (
          <FaTimes className="text-blue-800 w-5 h-5" />
        ) : (
          <FaBars className="text-blue-800 w-5 h-5" />
        )}
      </button>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative fixed inset-y-0 left-0 z-20 w-64`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
