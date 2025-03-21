import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoMdCalendar, IoMdMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";

import { FaUserFriends, FaBuilding, FaCalendarAlt, FaSearch, FaEye, FaTrashAlt } from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await ApiServices.getAllEvents();
      setEvents(response);
      setFilteredEvents(response);
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.programme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePreviewEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleClosePreview = () => {
    setSelectedEvent(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        // Replace with the actual API call to delete an event
        // await ApiServices.deleteEvent(eventId);
        showToast("Event deleted successfully");
        // Remove the event from the state
        setEvents(events.filter(event => event.programme_id !== eventId));
        setFilteredEvents(filteredEvents.filter(event => event.programme_id !== eventId));
      } catch (error) {
        console.error("Error deleting event:", error);
        showToast("Failed to delete event");
      }
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
            <FaCalendarAlt className="text-purple-400" />
            <h1 className="text-xl font-bold text-white">Manage Events</h1>
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
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 text-gray-300"
          >
            <FaBuilding />
            <span>Organizations</span>
          </Link>
          <Link
            to="/admin/events"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white"
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

        {/* Events Management Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">All Events</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-8 pr-4 py-1 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FaSearch className="absolute left-3 top-2 text-gray-400" />
              </div>
              <button 
                onClick={fetchEvents}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredEvents.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredEvents.map((event) => (
                      <tr key={event.programme_id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{event.programme_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.organization_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(event.start_date)} - {formatDate(event.end_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePreviewEvent(event)}
                              className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              title="Preview"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.programme_id)}
                              className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              title="Delete"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  {searchTerm ? "No events match your search" : "No events found"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Event Preview Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-90vh overflow-y-auto">
              <div className="border-b border-gray-700 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Event Preview</h2>
                <button 
                  onClick={handleClosePreview}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  {selectedEvent.image && (
                    <img 
                      src={selectedEvent.image} 
                      alt={selectedEvent.programme_name} 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedEvent.programme_name}</h3>
                  <div className="flex items-center text-purple-400 mb-4">
                    <IoMdCalendar className="mr-2" />
                    <span>{formatDate(selectedEvent.start_date)} - {formatDate(selectedEvent.end_date)}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{selectedEvent.description}</p>
                </div>
                
                <div className="bg-gray-750 rounded-lg p-4 mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Organization Details</h4>
                  <p className="text-gray-300 mb-1"><span className="font-medium">Name:</span> {selectedEvent.organization_name}</p>
                  <p className="text-gray-300 mb-1"><span className="font-medium">ID:</span> {selectedEvent.organization_id}</p>
                </div>
                
                <div className="bg-gray-750 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Contact Information</h4>
                  <div className="flex items-center text-gray-300 mb-2">
                    <IoMdMail className="mr-2" />
                    <span>{selectedEvent.contact_email}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FaPhone className="mr-2" />
                    <span>{selectedEvent.contact_phone}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-700 p-4 flex justify-end">
                <button
                  onClick={handleClosePreview}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 mr-2"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDeleteEvent(selectedEvent.programme_id);
                    handleClosePreview();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;