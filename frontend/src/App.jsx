import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider } from "./components/Context";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import AdminVolunteers from "./pages/Admin/Volunteers";
import AdminEvents from "./pages/Admin/Events";
import AdminOrganizations from "./pages/Admin/Organizations";
import AdminDashboard from "./pages/Admin/Dashboard";
import ApiServices from "./frontend-lib/api/ApiServices";
import { ToastContainer } from "react-toastify";
import { useStore } from "./store/store";

function ProtectedRoute({ element, adminOnly = false }) {
  const { user, setUser } = useStore();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await ApiServices.getUser();
          setUser(userData);
        } catch (error) {
          console.error("Authentication failed", error);
        }
      }
    };
    fetchUser();
  }, [token]);

  if (!token) return <Navigate to="/signin" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;
  return element;
}

function App() {
  return (
    <AppProvider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Router>
        <Routes>
          {/* Public Routes (Only Landing and Signin) */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />

          {/* Protected Routes (Only logged-in users) */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

          {/* Protected Admin Routes (Only admins) */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} adminOnly />} />
          <Route path="/admin/volunteers" element={<ProtectedRoute element={<AdminVolunteers />} adminOnly />} />
          <Route path="/admin/events" element={<ProtectedRoute element={<AdminEvents />} adminOnly />} />
          <Route path="/admin/organizations" element={<ProtectedRoute element={<AdminOrganizations />} adminOnly />} />

          {/* Fallback Route */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
