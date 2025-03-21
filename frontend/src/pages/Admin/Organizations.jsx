import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends, FaBuilding, FaCalendarAlt, FaChartLine, FaUserShield } from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const ManageOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const data = await ApiServices.adminGetAllOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      showToast("Failed to load organizations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = async (email, promote) => {
    try {
      const message = await ApiServices.updateUserRole(email, promote);
      showToast(message);
      try {
        const data = await ApiServices.adminGetAllOrganizations();
        if (!data) {
          navigate("/dashboard");
          window.location.reload();
        }
        setOrganizations(data);
      } catch (e) {
        navigate("/dashboard");
        window.location.reload();
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
            <FaBuilding className="text-green-400" />
            <h1 className="text-xl font-bold text-white">Manage Organizations</h1>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex overflow-x-auto mb-6 bg-gray-800 rounded-lg p-1">
          <Link
            to="/admin/volunteers"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 text-gray-300"
          >
            <FaUserFriends />
            <span>Volunteers</span>
          </Link>
          <Link
            to="/admin/organizations"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white"
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

        {/* Organizations Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Organization Accounts</h2>
            <button 
              onClick={fetchOrganizations}
              className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
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
                  {organizations.length > 0 ? (
                    organizations.map((organization) => (
                      <tr key={organization.email} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{organization.organization_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{organization.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            organization.role === "admin" 
                              ? "bg-purple-100 text-purple-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {organization.role === "admin" ? (
                              <>
                                <FaUserShield className="mr-1" />
                                Admin
                              </>
                            ) : (
                              "Organization"
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleRoleToggle(organization.email, organization.role !== "admin")}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                              organization.role === "admin"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            } transition-colors`}
                          >
                            {organization.role === "admin" ? "Demote from Admin" : "Promote to Admin"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-400 text-sm">
                        No organizations found
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

export default ManageOrganizations;