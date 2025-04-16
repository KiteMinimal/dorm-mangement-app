import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRooms } from "../utils/localStorage";

const AddResident = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load rooms data
    const roomsData = getRooms();
    // Filter rooms that have available space
    const availableRooms = roomsData.filter((room) => {
      const residents = JSON.parse(
        localStorage.getItem("dormResidents") || "[]"
      );
      const roomResidents = residents.filter(
        (resident) => resident.roomId === room.id
      );
      return roomResidents.length < room.capacity;
    });

    setRooms(availableRooms);

    // Check if roomId is provided in the URL query parameters
    const params = new URLSearchParams(location.search);
    const roomIdParam = params.get("roomId");

    if (roomIdParam) {
      // Verify that the room exists and has available space
      const selectedRoom = availableRooms.find(
        (room) => room.id === roomIdParam
      );
      if (selectedRoom) {
        setRoomId(roomIdParam);
      } else if (availableRooms.length > 0) {
        setRoomId(availableRooms[0].id);
      }
    } else if (availableRooms.length > 0) {
      setRoomId(availableRooms[0].id);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!name || !email || !roomId) {
      setError("Name, email, and room are required");
      return;
    }

    // Check if email already exists
    const residents = JSON.parse(localStorage.getItem("dormResidents") || "[]");
    const emailExists = residents.some((resident) => resident.email === email);

    if (emailExists) {
      setError("A resident with this email already exists");
      return;
    }

    // Check if room has available space
    const selectedRoom = rooms.find((room) => room.id === roomId);
    const roomResidents = residents.filter(
      (resident) => resident.roomId === roomId
    );

    if (roomResidents.length >= selectedRoom.capacity) {
      setError(
        `Room ${selectedRoom.number} in ${selectedRoom.building} is already at full capacity`
      );
      return;
    }

    // Create new resident
    const newResident = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      roomId,
    };

    // Add resident to localStorage
    residents.push(newResident);
    localStorage.setItem("dormResidents", JSON.stringify(residents));

    // Update room occupancy
    const allRooms = JSON.parse(localStorage.getItem("dormRooms") || "[]");
    const updatedRooms = allRooms.map((room) => {
      if (room.id === roomId) {
        const updatedOccupancy = roomResidents.length + 1;
        return {
          ...room,
          occupancy: updatedOccupancy,
          available: updatedOccupancy < room.capacity,
        };
      }
      return room;
    });

    localStorage.setItem("dormRooms", JSON.stringify(updatedRooms));

    // Show success message
    setSuccess("Resident added successfully");
    setError("");

    // Reset form
    setName("");
    setEmail("");
    setPhone("");

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Add New Resident</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Resident Details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details to add a new resident
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-4">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-4">
              <p>{success}</p>
            </div>
          )}

          {rooms.length === 0 ? (
            <div className="p-6">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                <p>No rooms available. Please add a room first.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-blue-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate("/add-room")}
                >
                  Add Room
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="room"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Room Assignment
                  </label>
                  <select
                    id="room"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    required
                  >
                    {rooms.map((room) => {
                      const residents = JSON.parse(
                        localStorage.getItem("dormResidents") || "[]"
                      );
                      const roomResidents = residents.filter(
                        (resident) => resident.roomId === room.id
                      );
                      return (
                        <option key={room.id} value={room.id}>
                          {room.building} - Room {room.number} (
                          {roomResidents.length}/{room.capacity} occupied)
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Resident
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddResident;
