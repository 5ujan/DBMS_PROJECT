import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import { useEffect, useMemo, lazy, Suspense } from "react";
import { AppProvider } from "./components/Context";
import { ToastContainer } from "react-toastify";
import { useStore } from "./store/store";
import ApiServices from "./frontend-lib/api/ApiServices";

// Lazy load pages for better performance
const Signin = lazy(() => import("./pages/Signin"));
const Home = lazy(() => import("./pages/Home"));
const Error = lazy(() => import("./pages/Error"));
const Landing = lazy(() => import("./pages/Landing"));
const Profile = lazy(() => import("./pages/Profile"));
const Events = lazy(() => import("./pages/Events"));
const Organization = lazy(() => import("./pages/Organization"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminVolunteers = lazy(() => import("./pages/Admin/Volunteers"));
const AdminEvents = lazy(() => import("./pages/Admin/Events"));
const AdminOrganizations = lazy(() => import("./pages/Admin/Organizations"));

// Hook to fetch user only when necessary
const useAuth = () => {
  const { user, setUser } = useStore();
  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const userData = await ApiServices.getUser();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Authentication failed, logging out:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/signin"; // Force logout
        }
      }
    };
    fetchUser();
  }, [token, user, setUser]);

  return { user, token };
};

function ProtectedRoute({ element, adminOnly = false }) {
  const { user, token } = useAuth();

  if (!token) return <Navigate to="/signin" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;
  
  return element;
}

function App() {
  return (
    <AppProvider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Router>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<Signin />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/organization/:id" element={<ProtectedRoute element={<Organization />} />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} adminOnly />} />
            <Route path="/admin/volunteers" element={<ProtectedRoute element={<AdminVolunteers />} adminOnly />} />
            <Route path="/admin/events" element={<ProtectedRoute element={<AdminEvents />} adminOnly />} />
            <Route path="/admin/organizations" element={<ProtectedRoute element={<AdminOrganizations />} adminOnly />} />

            {/* 404 Page */}
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </Router>
    </AppProvider>
  );
}

export default App;
