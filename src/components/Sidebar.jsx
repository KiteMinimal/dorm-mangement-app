import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaDoorOpen,
  FaSignOutAlt,
  FaUserPlus,
  FaPlusCircle,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen w-64 bg-blue-800 text-white flex flex-col">
      <div className="p-4 border-b border-blue-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">ResidentLife</h2>
        <button
          className="md:hidden text-white hover:text-gray-300"
          onClick={closeSidebar}
        >
          <FaTimes />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 ${
                isActive("/dashboard")
                  ? "bg-blue-900 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={() => closeSidebar()}
            >
              <FaTachometerAlt className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/rooms"
              className={`flex items-center px-4 py-3 ${
                isActive("/rooms")
                  ? "bg-blue-900 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={() => closeSidebar()}
            >
              <FaDoorOpen className="mr-3" />
              <span>Rooms</span>
            </Link>
          </li>
          <li>
            <Link
              to="/add-room"
              className={`flex items-center px-4 py-3 ${
                isActive("/add-room")
                  ? "bg-blue-900 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={() => closeSidebar()}
            >
              <FaPlusCircle className="mr-3" />
              <span>Add Room</span>
            </Link>
          </li>
          <li>
            <Link
              to="/add-resident"
              className={`flex items-center px-4 py-3 ${
                isActive("/add-resident")
                  ? "bg-blue-900 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={() => closeSidebar()}
            >
              <FaUserPlus className="mr-3" />
              <span>Add Resident</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={() => {
            handleLogout();
            closeSidebar();
          }}
          className="flex items-center text-blue-100 hover:text-white w-full"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
