import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends, FaBuilding, FaCalendarAlt, FaSearch, FaUserShield } from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const ManageOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrganizations(organizations);
    } else {
      const filtered = organizations.filter(
        (org) =>
          org.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    }
  }, [searchTerm, organizations]);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const data = await ApiServices.adminGetAllOrganizations();
      setOrganizations(data);
      setFilteredOrganizations(data);
    } catch (error) {
      showToast("Failed to load organizations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-full text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700">
            <IoIosArrowBack />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-semibold">Manage Organizations</h1>
        </div>

        <div className="flex bg-gray-800 p-3 rounded-lg gap-4">
          <input
            type="text"
            placeholder="Search organizations..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring focus:ring-green-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={fetchOrganizations} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg">Refresh</button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((organization) => (
                    <tr key={organization.email} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4">{organization.organization_name}</td>
                      <td className="px-6 py-4">{organization.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${organization.role === "admin" ? "bg-purple-500" : "bg-green-500"}`}>
                          {organization.role === "admin" ? "Admin" : "Organization"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className={`px-3 py-1 rounded-lg ${organization.role === "admin" ? "bg-red-600" : "bg-purple-600"}`}>
                          {organization.role === "admin" ? "Demote" : "Promote"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No organizations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrganizations;
