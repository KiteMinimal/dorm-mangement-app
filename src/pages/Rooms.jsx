import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, getResidentsByRoomId } from "../utils/localStorage";
import { FaSearch, FaFilter, FaPlusCircle, FaUserPlus } from "react-icons/fa";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);

  useEffect(() => {
    // Load rooms data
    const allRooms = getRooms();

    // Add residents data to each room
    const roomsWithResidents = allRooms.map((room) => {
      const residents = getResidentsByRoomId(room.id);
      return {
        ...room,
        residents,
        occupancyRate: residents.length / room.capacity,
      };
    });

    setRooms(roomsWithResidents);
    setFilteredRooms(roomsWithResidents);
  }, []);

  useEffect(() => {
    // Filter rooms based on search term and availability filter
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.building.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAvailable) {
      filtered = filtered.filter((room) => room.available);
    }

    setFilteredRooms(filtered);
  }, [searchTerm, filterAvailable, rooms]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
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
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="flex items-center mr-0 sm:mr-4 mb-2 sm:mb-0">
                <FaFilter className="text-gray-400 mr-2" />
                <span className="text-gray-600">Filters:</span>
              </div>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={filterAvailable}
                  onChange={() => setFilterAvailable(!filterAvailable)}
                />
                <span className="ml-2 text-gray-700">Available Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Room
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Building
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Occupancy
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr
                  key={room.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/room/${room.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {room.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Floor {room.floor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.building}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.type}</div>
                    <div className="text-sm text-gray-500">
                      Capacity: {room.capacity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {room.residents.length}/{room.capacity}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          room.occupancyRate >= 1 ? "bg-red-500" : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(room.occupancyRate * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        room.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.available ? "Available" : "Occupied"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Rooms;
