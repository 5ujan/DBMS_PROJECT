import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import axios from 'axios';
import ApiServices from '../frontend-lib/api/ApiServices';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const {user,setUser, setError} = useStore()
const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        console.log(token)
        const data = await ApiServices.getUser();
        console.log({token, user:data})
        setUser(data);
        // console.log(response.data)
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        } else {
          setError('Error fetching user data');
          console.error(err);
        }
      }
    };

    fetchUserData();
  }, [navigate, token]);

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
          {token ? (
            <div className="flex items-center space-x-4">
              {/* {user?.role === 'organization' && (
            )} */}
                <Link to="/events" className="text-white">Events</Link>
              <Link to="/profile" className="text-white">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signin" className="text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
