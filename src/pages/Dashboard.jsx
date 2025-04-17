import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getTotalRoomsCount,
  getAvailableRoomsCount,
  getTotalResidentsCount,
  getOccupancyPercentage,
  getAvailableRooms,
  getRoomOccupancy,
} from "../utils/localStorage";
import {
  FaUserAlt,
  FaDoorOpen,
  FaBuilding,
  FaUserPlus,
  FaPlusCircle,
  FaUserCog,
} from "react-icons/fa";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [totalResidents, setTotalResidents] = useState(0);
  const [occupancyPercentage, setOccupancyPercentage] = useState(0);
  const [roomsList, setRoomsList] = useState([]);
  const [hoveredRoomId, setHoveredRoomId] = useState(null);

  useEffect(() => {
    // Load dashboard data
    setTotalRooms(getTotalRoomsCount());
    setAvailableRooms(getAvailableRoomsCount());
    setTotalResidents(getTotalResidentsCount());
    setOccupancyPercentage(getOccupancyPercentage());

    // Load available rooms
    const rooms = getAvailableRooms();

    // Add occupancy data to each room
    const roomsWithOccupancy = rooms.map((room) => ({
      ...room,
      currentOccupancy: getRoomOccupancy(room.id),
    }));

    setRoomsList(roomsWithOccupancy);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        {/* Mobile Nav (Logo + Hamburger) */}
        <div className="flex items-center justify-between px-4 py-3 sm:hidden">
          <img src="/logo.png" alt="ResidentLife Logo" className="h-8 w-auto" />
          
        </div>
        {/* Desktop Nav (Dashboard title + profile) */}
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 hidden sm:flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
            {currentUser?.name?.charAt(0) || "U"}
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-2">
          <span className="text-sm text-gray-600">Campus: East Hall</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Total Rooms */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FaBuilding className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Rooms
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {totalRooms}
                      </div>
                      <div className="text-sm text-gray-500">3 buildings</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Available Rooms */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FaDoorOpen className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Available Rooms
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {availableRooms}
                      </div>
                      <div className="text-sm text-gray-500">
                        {occupancyPercentage}% occupancy
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Residents */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FaUserAlt className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Residents
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {totalResidents}
                      </div>
                      <div className="text-sm text-gray-500">
                        12 new this month
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rooms Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Available Rooms
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Quick assign rooms to new residents
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/add-room")}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <FaPlusCircle className="mr-2" />
                Add Room
              </button>
              <button
                onClick={() => navigate("/add-resident")}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full sm:w-auto"
              >
                <FaUserPlus className="mr-2" />
                Add Resident
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
            {roomsList.map((room) => (
              <div
                key={room.id}
                className="border rounded-lg overflow-hidden relative group cursor-pointer"
                onClick={() => navigate(`/room/${room.id}`)}
                onMouseEnter={() => setHoveredRoomId(room.id)}
                onMouseLeave={() => setHoveredRoomId(null)}
              >
                {hoveredRoomId === room.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/add-resident?roomId=${room.id}`);
                      }}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                    >
                      <FaUserCog className="mr-2" />
                      Assign Room
                    </button>
                  </div>
                )}
                <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                  <span className="font-medium">Room {room.number}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    available
                  </span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Building</p>
                      <p className="font-medium">{room.building}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Floor</p>
                      <p className="font-medium">{room.floor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{room.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupancy</p>
                      <p className="font-medium">
                        {room.currentOccupancy}/{room.capacity}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (room.currentOccupancy / room.capacity) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Occupancy</span>
                      <span className="text-xs text-gray-500">
                        {Math.round(
                          (room.currentOccupancy / room.capacity) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
