import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-blue-800 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block md:relative fixed inset-0 z-10`}
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
