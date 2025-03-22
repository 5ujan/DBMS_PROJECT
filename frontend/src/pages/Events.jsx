import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav';
import { useStore } from '../store/store';
import ApiServices from '../frontend-lib/api/ApiServices';
import { showToast } from '../utils/toasts';
import LocationEditorSection from '../components/LocationPicker';
import { FaTrashAlt } from 'react-icons/fa';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useStore();
  const [selectedEvent, setSelectedEvent] = useState(null); // For showing selected event details
  const [isModalOpen, setIsModalOpen] = useState(false); // For showing event details modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For showing create event modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For showing edit event modal
  const [eventData, setEventData] = useState({ programme_name: '', description: '', start_date: '', end_date: '' });
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await ApiServices.getAllEvents(); // Use the ApiServices method
      console.log(response)
      setEvents(response);
      setFilteredEvents(response);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredEvents(events);
    } else if (filter === 'myEvents' && user?.role === 'organization') {
      setFilteredEvents(events.filter(event => event.organization_name === user?.name));
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filter, events, user]);

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const openCreateModal = (event=false) => {
    {event ? setSelectedEvent(event) : setSelectedEvent(eventData)}
    setIsCreateModalOpen(true);   
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEventData({ programme_name: '', description: '', start_date: '', end_date: '' }); // Clear form
  };

  const handleCreateEvent = async () => {
    if(uploading) return;
    setUploading(true);
    if(eventData.image instanceof File){
      const imageUrl = await ApiServices.uploadPhotoToCloudinary(eventData.image);
      eventData.image = imageUrl;
    }
    else{ 
      console.log("not a file");
    }
    try {
      console.log(eventData)
      await ApiServices.createEvent(eventData);
      // After successful creation, fetch events again and close the modal
      await fetchEvents();
      closeModal();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateEvent = async () => {
    if(selectedEvent.image instanceof File){
      const imageUrl = await ApiServices.uploadPhotoToCloudinary(selectedEvent.image);
      selectedEvent.image = imageUrl;
    }
    try {
      const response = await ApiServices.updateEvent(
        selectedEvent.programme_id, 
        {...selectedEvent, start_date: selectedEvent.start_date.split("T")[0], end_date: selectedEvent.end_date.split("T")[0]}
      );
      // After successful update, fetch events again and close the modal
      const updatedEvents = events.map(event => (event.programme_id === response.programme_id ? response : event));
      setEvents(updatedEvents);
      closeModal();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
   const handleDeleteEvent = async(event) =>{
    const response = await ApiServices.deleteEvent(event.programme_id)
    if(response) {
      showToast("Deleted Succesfully");
      closeModal()
      await fetchEvents();
    }

   }
  return (
    <div className="bg-black text-white w-full min-h-screen">
      <Navbar />
      <div className="p-6">
        {user?.role === 'organization' && (
          <div className="text-end self-end mb-10 flex gap-4 justify-end">
            <button
              onClick={() => openCreateModal(false)}
              className="bg-dark-green font-bold text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Add Event
            </button>
            <button
              onClick={() => setFilter(filter === 'all' ? 'myEvents' : 'all')}
              className="bg-dark-green font-bold text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {filter === 'all' ? 'Show My Events' : 'Show All Events'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dark-green"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <div key={event.programme_id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="text-xl font-semibold mt-3">{event.programme_name}</h3>
                    <div className='flex justify-between items-center'>
                      <h2 className='text-lg font-semibold mt-2'>{event.organization_name}</h2>
                      <p className="text-gray-400 text-sm mt-1">{event.start_date.split('T')[0]}</p>
                    </div>
                    <p className="text-gray-300 mt-2 line-clamp-2">{event.description}</p>
                    <button
                      onClick={() => openEventModal(event)}
                      className="bg-dark-green text-white px-4 py-2 mt-4 rounded-md hover:bg-green-700"
                    >
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-xl">No events found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredEvents.length > eventsPerPage && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 mx-1 rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-dark-green text-white hover:bg-green-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex">
                    {Array.from({ length: totalPages }, (_, i) => {
                      // Show 1, 2, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages-1, totalPages
                      // Or show just a few pages around current page if there are many pages
                      if (
                        i === 0 || // First page
                        i === totalPages - 1 || // Last page
                        (i >= currentPage - 2 && i <= currentPage) || // Current and 2 before
                        (i <= currentPage + 1 && i >= currentPage) // Current and 1 after
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 mx-1 rounded-md ${
                              currentPage === i + 1
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      } else if (
                        (i === 1 && currentPage > 3) || 
                        (i === totalPages - 2 && currentPage < totalPages - 2)
                      ) {
                        // Show ellipsis for skipped pages
                        return <span key={i} className="px-3 py-1 mx-1">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 mx-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-dark-green text-white hover:bg-green-700'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {isModalOpen && <EventModal event={selectedEvent} onEdit={openEditModal} onClose={closeModal} user={user} navigate={navigate} onDelete={handleDeleteEvent} />}

      {/* Create Event Modal */}
      {isCreateModalOpen && <CreateEventModal eventData={eventData} setEventData={setEventData} onClose={closeModal} onCreate={handleCreateEvent} />}
      {isEditModalOpen && <EditEventModal event={selectedEvent} setEventData={setSelectedEvent} onClose={closeModal} onEdit={handleUpdateEvent} />}
    </div>
  );
};

export const EventModal = ({ event, onClose, user, navigate, onEdit, onDelete }) => {
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      try {
        const response = await ApiServices.getEventVolunteers(event.programme_id);
        setRegisteredVolunteers(response);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [event.programme_id]);

  const handleRegister = async () => {
    try {
      const response = await ApiServices.registerVolunteer(event.programme_id);
      if (response) {
        showToast('Registered successfully!');
        // Refresh volunteer list after registration
        const updatedVolunteers = await ApiServices.getEventVolunteers(event.programme_id);
        setRegisteredVolunteers(updatedVolunteers);
      } else {
        alert('Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  return (
    <div className="fixed inset-0  max-h-90% overflow-auto scrollbar-hide bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl h-auto max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl md:text-2xl font-semibold truncate">{event?.programme_name}</h2>
          <button 
            onClick={onClose} 
            className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <span className="text-white font-medium">✕</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 mb-3 gap-6">
            {/* Left column: Image and event details */}
            <div>
              {event?.image && (
                <div className="mb-4 w-full max-w-xs mx-auto h-auto max-h-64 overflow-hidden rounded-lg">
                  <img src={event.image} alt="Event" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="space-y-3 bg-gray-700 p-4 rounded-lg">
                <p><strong>Organizer:</strong> {event?.organization_name}</p>
                <p><strong>Start Date:</strong> {event?.start_date?.split("T")[0]}</p>
                <p><strong>End Date:</strong> {event?.end_date?.split("T")[0]}</p>
                <p><strong>Description:</strong> {event?.description}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {user?.role !== 'organization' && (
                  <>
                    <button 
                      className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex-grow md:flex-grow-0" 
                      onClick={handleRegister}
                    >
                      Register for Event
                    </button>
                    <button 
                      onClick={() => navigate("/organization/" + event.organization_id)} 
                      className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex-grow md:flex-grow-0"
                    >
                      View Organization
                    </button>
                  </>
                )}
                {user?.role === 'organization' && event?.organization_name === user?.name && (
                  <button 
                    onClick={() => onEdit(event)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit Event
                  </button>
                )}
                {(user?.role === 'organization' && event?.organization_name === user?.name || user?.role=== 'admin' )&& (
                  <button 
                    onClick={() => onDelete(event)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    <FaTrashAlt/>
                  </button>
                )}
              </div>
            </div>

            {/* Right column: Volunteer list */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Registered Volunteers</h3>
                <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-sm">
                  {registeredVolunteers.length} volunteer{registeredVolunteers.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : registeredVolunteers.length > 0 ? (
                <div className="overflow-y-auto max-h-64 pr-1">
                  <ul className="space-y-2">
                    {registeredVolunteers.map((volunteer, index) => (
                      <li 
                        key={volunteer.id || index} 
                        className="bg-gray-800 p-3 rounded-lg flex items-center gap-3"
                      >
                        {volunteer.avatar ? (
                          <img 
                            src={volunteer.avatar} 
                            alt="" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center">
                            {volunteer.name?.charAt(0) || "V"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{volunteer.name || "Anonymous Volunteer"}</p>
                          {volunteer.email && <p className="text-sm text-gray-400">{volunteer.email}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-lg text-center h-64 flex items-center justify-center">
                  <p className="text-gray-400">No volunteers have registered yet</p>
                </div>
              )}
            </div>
          </div>
          <LocationEditorSection user={event} isEditing={false} handleLocationUpdate={()=>{}}></LocationEditorSection>
        </div>
      </div>
    </div>
  );
};
export const EditEventModal = ({ event,setEventData, onClose, onEdit }) => {
  const [imagePreview, setImagePreview] = useState(event.image || null);
  
  const handleInputChange = (e) => {
    setEventData({ ...event, [e.target.name]: e.target.value });
  };
 const  handleLocationUpdate = ({ location, address }) => {
    setEventData({ ...event, location, address });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEventData({ ...event, image: file });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  max-h-90% overflow-auto scrollbar-hide flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-2/3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Event</h2>
          <button onClick={onClose} className="text-black text-lg font-bold">X</button>
        </div>
        <div className="mt-4">
          <label className="block text-gray-300 font-medium mb-1">Event Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={event.programme_name}
            name="programme_name"
            onChange={(e) => handleInputChange(e)}
            placeholder="Enter event name"
          />
          <label className="block text-gray-300 font-medium mb-1">Event Description</label>
          <textarea
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={event.description}
            onChange={(e) => setEventData({ ...event, description: e.target.value })}
            placeholder="Enter event description"
          />
          <label className="block text-gray-300 font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={event.start_date.split("T")[0]}
            onChange={(e) => setEventData({ ...event, start_date: e.target.value })}
          />
          <label className="block text-gray-300 font-medium mb-1">End Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={event.end_date.split("T")[0]}
            onChange={(e) => setEventData({ ...event, end_date: e.target.value })}
          />
          <label className="block text-gray-300 font-medium mb-1">Event Image</label>
          <input
            type="file" 
            accept="image/*"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            onChange={handleImageChange}
          />
          {imagePreview && (  
            <div className="mb-4">
              <p className="text-gray-300 mb-2">Image Preview:</p>
              <img src={imagePreview} alt="Event" className="w-full h-40 object-cover rounded" />
            </div>
          )}
        </div>
          <LocationEditorSection isEditing={true} user={event} onLocationUpdate={handleLocationUpdate}></LocationEditorSection>

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4">
            Cancel
          </button>
          <button onClick={onEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateEventModal = ({ eventData, setEventData, onClose, onCreate }) => {

  const [imagePreview, setImagePreview] = useState(eventData.image || null);
  const [isEditingLocation, setIsEditingLocation] = useState(true);


  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };
  const  handleLocationUpdate = ({ location, address }) => {
    setEventData({ ...eventData, location, address });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEventData({ ...eventData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute top-0 py-10 w-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 overflow-auto max-h-[90vh] scrollbar-hide p-6 rounded-lg w-2/3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Create New Event</h2>
          <button onClick={onClose} className="text-white text-lg font-bold">X</button>
        </div>
        <div className="mt-4">
          <label className="block text-gray-300 font-medium mb-1">Event Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={eventData.programme_name}
            name="programme_name"
            onChange={(e) => handleInputChange(e)}
            placeholder="Enter event name"
          />

          <label className="block text-gray-300 font-medium mb-1">Event Description</label>
          <textarea
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            placeholder="Enter event description"
          />

          <label className="block text-gray-300 font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={eventData.start_date.split("T")[0]}
            onChange={(e) => setEventData({ ...eventData, start_date: e.target.value })}
          />

          <label className="block text-gray-300 font-medium mb-1">End Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            value={eventData.end_date.split("T")[0]}
            onChange={(e) => setEventData({ ...eventData, end_date: e.target.value })}
          />

          <label className="block text-gray-300 font-medium mb-1">Event Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-700 text-white"
            onChange={handleImageChange}
          />

          {imagePreview && (
            <div className="mb-4">
              <p className="text-gray-300 mb-2">Image Preview:</p>
              <img src={imagePreview} alt="Event" className="w-full h-40 object-cover rounded" />
            </div>
          )}
        </div>
        <LocationEditorSection 
            isEditing={isEditingLocation} 
            user={{...eventData, location:{lat:27.6630019,lng:85.2774207}}}
            onLocationUpdate={handleLocationUpdate} 
          />
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4">
            Cancel
          </button>
          <button onClick={onCreate} className="bg-green-500 text-white px-4 py-2 rounded-md">
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};


export default Events;
