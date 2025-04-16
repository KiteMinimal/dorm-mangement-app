import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { initializeDormData } from "./utils/localStorage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import AddResident from "./pages/AddResident";
import RoomDetails from "./pages/RoomDetails";

function App() {
  useEffect(() => {
    // Initialize sample data in localStorage
    initializeDormData();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/add-resident" element={<AddResident />} />
            <Route path="/room/:roomId" element={<RoomDetails />} />
          </Route>

          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
