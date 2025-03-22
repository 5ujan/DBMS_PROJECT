import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoMdSearch } from "react-icons/io";
import { FaUserFriends, FaBuilding, FaCalendarAlt, FaUserShield, FaFilter, FaSearch } from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    // Apply filters and search whenever volunteers, searchTerm or filterRole changes
    applyFiltersAndSearch();
  }, [volunteers, searchTerm, filterRole]);

  const applyFiltersAndSearch = () => {
    let filtered = [...volunteers];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (volunteer) =>
          volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((volunteer) => volunteer.role === filterRole);
    }

    setFilteredVolunteers(filtered);
  };

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const data = await ApiServices.adminGetAllVolunteers();
      setVolunteers(data);
      setFilteredVolunteers(data);
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
        applyFiltersAndSearch();
      } catch (e) {
        console.log(e);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error toggling role:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
    setFilteredVolunteers(volunteers);
    showToast("Filters cleared");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              to="/admin"
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
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  className="pl-8 pr-4 py-1 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FaSearch className="absolute left-3 top-2 text-gray-400" />
              </div>
              
              <button
                onClick={toggleFilterPanel}
                className={`px-3 py-1 text-gray-200 rounded transition-colors text-sm flex items-center gap-1 ${
                  filterRole !== "all" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
                }`}
                title="Filter volunteers"
              >
                <FaFilter />
                <span>Filter</span>
              </button>
              
              {filterRole !== "all" && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 bg-red-600 text-gray-200 rounded hover:bg-red-700 transition-colors text-sm"
                  title="Clear filters"
                >
                  Clear Filters
                </button>
              )}
              
              <button 
                onClick={fetchVolunteers}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-gray-800 p-4 rounded-xl flex-1">
                  <h3 className="text-lg font-semibold text-white mb-4">Filter Settings</h3>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 font-medium mb-2">
                      Filter by Role
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterRole("all")}
                        className={`px-4 py-2 rounded-md ${
                          filterRole === "all" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        All Roles
                      </button>
                      <button
                        onClick={() => setFilterRole("admin")}
                        className={`px-4 py-2 rounded-md ${
                          filterRole === "admin" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        <FaUserShield className="inline mr-1" />
                        Admins Only
                      </button>
                      <button
                        onClick={() => setFilterRole("volunteer")}
                        className={`px-4 py-2 rounded-md ${
                          filterRole === "volunteer" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Volunteers Only
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => setShowFilterPanel(false)}
                      className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-xl flex-1">
                  <h3 className="text-lg font-semibold text-white mb-4">Search Tips</h3>
                  <p className="text-gray-300 mb-3">You can search by:</p>
                  <ul className="text-gray-400 list-disc pl-5 space-y-1">
                    <li>Volunteer name</li>
                    <li>Email address</li>
                  </ul>
                  <div className="mt-4 p-3 bg-gray-750 rounded-md text-gray-300 text-sm">
                    <strong>Currently active filters:</strong><br />
                    Role: {filterRole === "all" ? "All roles" : filterRole === "admin" ? "Admins only" : "Volunteers only"}<br />
                    {searchTerm && <span>Search term: "{searchTerm}"</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredVolunteers.length > 0 ? (
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
                    {filteredVolunteers.map((volunteer) => (
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
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  {searchTerm || filterRole !== "all" 
                    ? "No volunteers match your search criteria"
                    : "No volunteers found"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards - optional addition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-500 bg-opacity-20 mr-4">
                <FaUserFriends className="text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Total Volunteers</h3>
                <p className="text-white text-2xl font-bold">
                  {volunteers.filter(v => v.role === "volunteer").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-purple-500 bg-opacity-20 mr-4">
                <FaUserShield className="text-purple-400 text-xl" />
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Total Admins</h3>
                <p className="text-white text-2xl font-bold">
                  {volunteers.filter(v => v.role === "admin").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-500 bg-opacity-20 mr-4">
                <FaUserFriends className="text-green-400 text-xl" />
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Current Search Results</h3>
                <p className="text-white text-2xl font-bold">
                  {filteredVolunteers.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVolunteers;