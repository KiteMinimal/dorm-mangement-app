import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBuildings } from '../utils/localStorage';

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [type, setType] = useState('Single');
  const [capacity, setCapacity] = useState(1);
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load buildings data
    const buildingsData = getBuildings();
    setBuildings(buildingsData);
    
    if (buildingsData.length > 0) {
      setBuilding(buildingsData[0].name);
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!roomNumber || !building || !floor || !type || !capacity) {
      setError('All fields are required');
      return;
    }
    
    // Check if room number already exists in the selected building
    const rooms = JSON.parse(localStorage.getItem('dormRooms') || '[]');
    const roomExists = rooms.some(room => 
      room.number === roomNumber && room.building === building
    );
    
    if (roomExists) {
      setError(`Room ${roomNumber} already exists in ${building}`);
      return;
    }
    
    // Create new room
    const newRoom = {
      id: Date.now().toString(),
      number: roomNumber,
      building,
      floor: parseInt(floor),
      type,
      capacity: parseInt(capacity),
      occupancy: 0,
      available: true
    };
    
    // Add room to localStorage
    rooms.push(newRoom);
    localStorage.setItem('dormRooms', JSON.stringify(rooms));
    
    // Update building's total rooms count
    const updatedBuildings = buildings.map(b => {
      if (b.name === building) {
        return {
          ...b,
          totalRooms: b.totalRooms + 1
        };
      }
      return b;
    });
    
    localStorage.setItem('dormBuildings', JSON.stringify(updatedBuildings));
    
    // Show success message
    setSuccess('Room added successfully');
    setError('');
    
    // Reset form
    setRoomNumber('');
    setFloor('');
    setType('Single');
    setCapacity(1);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/rooms');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Room Details</h3>
            <p className="mt-1 text-sm text-gray-500">Fill in the details to add a new room</p>
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
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                  Room Number
                </label>
                <input
                  type="text"
                  id="roomNumber"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                  Building
                </label>
                <select
                  id="building"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  required
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                  Floor
                </label>
                <input
                  type="number"
                  id="floor"
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Room Type
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    // Set default capacity based on room type
                    switch (e.target.value) {
                      case 'Single':
                        setCapacity(1);
                        break;
                      case 'Double':
                        setCapacity(2);
                        break;
                      case 'Triple':
                        setCapacity(3);
                        break;
                      case 'Quad':
                        setCapacity(4);
                        break;
                      default:
                        setCapacity(1);
                    }
                  }}
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Quad">Quad</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  min="1"
                  max="10"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                onClick={() => navigate('/rooms')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddRoom;
