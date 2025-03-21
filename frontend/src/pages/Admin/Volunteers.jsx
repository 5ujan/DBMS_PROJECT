import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends, FaBuilding, FaCalendarAlt, FaUserShield } from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const data = await ApiServices.adminGetAllVolunteers();
      setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      showToast("Failed to load volunteers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = async (email, promote) => {
    try {
      console.log(email, promote);
      const message = await ApiServices.updateUserRole(email, promote);
      showToast(message);
      try {
        const data = await ApiServices.adminGetAllVolunteers();
        console.log({ data });
        if (!data) {
          navigate("/dashboard");
          window.location.reload();
        }
        setVolunteers(data);
      } catch (e) {
        console.log(e);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error toggling role:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg shadow-sm hover:bg-gray-700 transition-colors"
            >
              <IoIosArrowBack />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-blue-400" />
            <h1 className="text-xl font-bold text-white">Manage Volunteers</h1>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex overflow-x-auto mb-6 bg-gray-800 rounded-lg p-1">
          <Link
            to="/admin/volunteers"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white"
          >
            <FaUserFriends />
            <span>Volunteers</span>
          </Link>
          <Link
            to="/admin/organizations"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 text-gray-300"
          >
            <FaBuilding />
            <span>Organizations</span>
          </Link>
          <Link
            to="/admin/events"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 text-gray-300"
          >
            <FaCalendarAlt />
            <span>Events</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 text-gray-300 ml-auto"
          >
            <span>Normal Mode</span>
          </Link>
        </div>

        {/* Volunteers Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Volunteer Accounts</h2>
            <button 
              onClick={fetchVolunteers}
              className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {volunteers.length > 0 ? (
                    volunteers.map((volunteer) => (
                      <tr key={volunteer.email} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{volunteer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{volunteer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            volunteer.role === "admin" 
                              ? "bg-purple-100 text-purple-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {volunteer.role === "admin" ? (
                              <>
                                <FaUserShield className="mr-1" />
                                Admin
                              </>
                            ) : (
                              "Volunteer"
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleRoleToggle(volunteer.email, volunteer.role !== "admin")}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                              volunteer.role === "admin"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            } transition-colors`}
                          >
                            {volunteer.role === "admin" ? "Demote from Admin" : "Promote to Admin"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-400 text-sm">
                        No volunteers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVolunteers;