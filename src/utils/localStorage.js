// Initialize the dorm data in localStorage if it doesn't exist
export const initializeDormData = () => {
  // Check if data already exists
  if (!localStorage.getItem("dormRooms")) {
    // Create sample rooms data
    const rooms = [
      {
        id: "1",
        number: "102",
        building: "East Hall",
        floor: 1,
        type: "Double",
        capacity: 2,
        occupancy: 1,
        available: true,
      },
      {
        id: "2",
        number: "401",
        building: "East Hall",
        floor: 4,
        type: "Quad",
        capacity: 4,
        occupancy: 3,
        available: true,
      },
      {
        id: "3",
        number: "215",
        building: "West Hall",
        floor: 2,
        type: "Triple",
        capacity: 3,
        occupancy: 2,
        available: true,
      },
    ];

    // Create sample residents data
    const residents = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        roomId: "1",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        roomId: "2",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        roomId: "2",
      },
      {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        roomId: "2",
      },
      {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie@example.com",
        roomId: "3",
      },
      {
        id: "6",
        name: "Diana Miller",
        email: "diana@example.com",
        roomId: "3",
      },
    ];

    // Create sample buildings data
    const buildings = [
      {
        id: "1",
        name: "East Hall",
        totalRooms: 2,
      },
      {
        id: "2",
        name: "West Hall",
        totalRooms: 1,
      },
    ];

    // Store data in localStorage
    localStorage.setItem("dormRooms", JSON.stringify(rooms));
    localStorage.setItem("dormResidents", JSON.stringify(residents));
    localStorage.setItem("dormBuildings", JSON.stringify(buildings));
  }
};

// Get all rooms
export const getRooms = () => {
  return JSON.parse(localStorage.getItem("dormRooms") || "[]");
};

// Get available rooms
export const getAvailableRooms = () => {
  const rooms = getRooms();
  return rooms.filter((room) => room.available);
};

// Get room by id
export const getRoomById = (id) => {
  const rooms = getRooms();
  return rooms.find((room) => room.id === id);
};

// Get all residents
export const getResidents = () => {
  return JSON.parse(localStorage.getItem("dormResidents") || "[]");
};

// Get resident by id
export const getResidentById = (id) => {
  const residents = getResidents();
  return residents.find((resident) => resident.id === id);
};

// Get all buildings
export const getBuildings = () => {
  return JSON.parse(localStorage.getItem("dormBuildings") || "[]");
};

// Get building by id
export const getBuildingById = (id) => {
  const buildings = getBuildings();
  return buildings.find((building) => building.id === id);
};

// Get total rooms count
export const getTotalRoomsCount = () => {
  const rooms = getRooms();
  return rooms.length;
};

// Get available rooms count
export const getAvailableRoomsCount = () => {
  const rooms = getAvailableRooms();
  return rooms.length;
};

// Get total residents count
export const getTotalResidentsCount = () => {
  const residents = getResidents();
  return residents.length;
};

// Get occupancy percentage
export const getOccupancyPercentage = () => {
  const rooms = getRooms();
  const availableRooms = getAvailableRooms();
  return Math.round(
    ((rooms.length - availableRooms.length) / rooms.length) * 100
  );
};

// Get residents by room id
export const getResidentsByRoomId = (roomId) => {
  const residents = getResidents();
  return residents.filter((resident) => resident.roomId === roomId);
};

// Get room occupancy
export const getRoomOccupancy = (roomId) => {
  const residents = getResidentsByRoomId(roomId);
  return residents.length;
};

// Add a new room
export const addRoom = (roomData) => {
  const rooms = getRooms();
  const newRoom = {
    id: Date.now().toString(),
    ...roomData,
    occupancy: 0,
    available: true,
  };

  rooms.push(newRoom);
  localStorage.setItem("dormRooms", JSON.stringify(rooms));

  // Update building's total rooms count
  const buildings = getBuildings();
  const updatedBuildings = buildings.map((b) => {
    if (b.name === roomData.building) {
      return {
        ...b,
        totalRooms: b.totalRooms + 1,
      };
    }
    return b;
  });

  localStorage.setItem("dormBuildings", JSON.stringify(updatedBuildings));

  return newRoom;
};

// Add a new resident
export const addResident = (residentData) => {
  const residents = getResidents();
  const newResident = {
    id: Date.now().toString(),
    ...residentData,
  };

  residents.push(newResident);
  localStorage.setItem("dormResidents", JSON.stringify(residents));

  // Update room occupancy
  const rooms = getRooms();
  const updatedRooms = rooms.map((room) => {
    if (room.id === residentData.roomId) {
      const roomResidents = getResidentsByRoomId(room.id);
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

  return newResident;
};

// Add a new building
export const addBuilding = (buildingData) => {
  const buildings = getBuildings();
  const newBuilding = {
    id: Date.now().toString(),
    ...buildingData,
    totalRooms: 0,
  };

  buildings.push(newBuilding);
  localStorage.setItem("dormBuildings", JSON.stringify(buildings));

  return newBuilding;
};
