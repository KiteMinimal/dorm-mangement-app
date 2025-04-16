import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, getResidentsByRoomId } from "../utils/localStorage";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (roomId) {
      const roomData = getRoomById(roomId);
      if (roomData) {
        setRoom(roomData);
        const roomResidents = getResidentsByRoomId(roomId);
        setResidents(roomResidents);
      } else {
        setError("Room not found");
      }
    } else {
      setError("Invalid room ID");
    }
    setLoading(false);
  }, [roomId]);

  // Generate bed layout based on room type and capacity
  const renderBedLayout = () => {
    if (!room) return null;

    // Create an array of beds based on room capacity
    const beds = Array.from({ length: room.capacity }, (_, index) => {
      // Check if this bed is occupied
      const isOccupied = index < residents.length;
      const resident = isOccupied ? residents[index] : null;

      return (
        <div
          key={index}
          className={`border-2 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center ${
            isOccupied
              ? "border-red-500 bg-red-100"
              : "border-green-500 bg-green-100"
          }`}
        >
          <div className="w-12 sm:w-16 h-6 sm:h-8 border-2 border-gray-700 rounded-t-lg mb-2"></div>
          <div className="w-12 sm:w-16 h-20 sm:h-24 border-2 border-gray-700"></div>
          {isOccupied ? (
            <div className="mt-2 text-center">
              <p className="font-medium text-sm">{resident.name}</p>
              <p className="text-xs text-gray-500">{resident.email}</p>
            </div>
          ) : (
            <div className="mt-2 text-center">
              <p className="font-medium text-sm">Available</p>
              <button
                onClick={() => navigate(`/add-resident?roomId=${roomId}`)}
                className="mt-1 text-xs text-blue-500 hover:text-blue-700 flex items-center"
              >
                <FaUserPlus className="mr-1" />
                Assign
              </button>
            </div>
          )}
        </div>
      );
    });

    // Arrange beds based on room type and screen size
    let layoutClassName = "grid gap-4 sm:gap-6 mt-6";

    switch (room.type) {
      case "Single":
        layoutClassName += " grid-cols-1";
        break;
      case "Double":
        layoutClassName += " grid-cols-1 sm:grid-cols-2";
        break;
      case "Triple":
        layoutClassName += " grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
        break;
      case "Quad":
        layoutClassName += " grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
        break;
      default:
        // For larger rooms, use a responsive grid
        layoutClassName +=
          " grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }

    return <div className={layoutClassName}>{beds}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Room Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {room && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Room {room.number}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {room.building} - Floor {room.floor}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    room.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.available ? "Available" : "Full"}
                </span>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">
                    Room Type
                  </h4>
                  <p className="mt-1 text-lg font-semibold">{room.type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">
                    Capacity
                  </h4>
                  <p className="mt-1 text-lg font-semibold">{room.capacity}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">
                    Occupancy
                  </h4>
                  <p className="mt-1 text-lg font-semibold">
                    {residents.length}/{room.capacity}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900">
                  Bed Layout
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Green beds are available, red beds are occupied
                </p>
                {renderBedLayout()}
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900">Residents</h4>
                {residents.length > 0 ? (
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Phone
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {residents.map((resident) => (
                            <tr key={resident.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {resident.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {resident.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {resident.phone || "N/A"}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700">
                      No residents assigned to this room yet.
                    </p>
                    <button
                      onClick={() => navigate(`/add-resident?roomId=${roomId}`)}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaUserPlus className="mr-1" />
                      Add Resident
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomDetails;
