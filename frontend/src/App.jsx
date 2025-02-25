import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

function ProtectedRoute({ element }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {user, setUser} = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await ApiServices.getUser();
        setUser(user);

        setIsAuthenticated(!!user); // Set true if user exists
      } catch (error) {
        console.error("Authentication failed", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? element : <Navigate to="/signin" replace />;
}

function App() {
  const {user, setUser} = useStore();
  useEffect(() => { 

    (async () => {
      
      try{
      const user = await ApiServices.getUser();
      setUser(user);
      
        
    }catch(e){
      console.log(e)
    }
  })();

  }, []);
  
  return (
    <AppProvider>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/admin/volunteers" element={<ProtectedRoute element={<AdminVolunteers />} />} />
          <Route path="/admin/events" element={<ProtectedRoute element={<AdminEvents />} />} />
          <Route path="/admin/organizations" element={<ProtectedRoute element={<AdminOrganizations />} />} />

          {/* Fallback Route */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
