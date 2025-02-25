import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import axios from 'axios';
import ApiServices from '../frontend-lib/api/ApiServices';

const Navbar = () => {
  const {user, setUser} = useStore();
  console.log(user)
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     navigate('/signin');
//   };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/signin';
  };

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-2xl font-semibold">
          Dashboard
        </Link>
        <div>
            <div className="flex items-center space-x-4">
              {/* {user?.role === 'organization' && (
            )} */}
                <Link to="/events" className="text-white">Events</Link>
              <Link to="/profile" className="text-white">Profile</Link>
              {user?.role === 'admin' && (
                <Link to="/admin/" className="text-white">Admin</Link>
              )}  
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
