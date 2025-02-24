import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Nav';
import { useStore } from '../store/store';
import ApiServices from '../frontend-lib/api/ApiServices';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useStore();
  const [selectedEvent, setSelectedEvent] = useState(null); // For showing selected event details
  const [isModalOpen, setIsModalOpen] = useState(false); // For showing event details modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For showing create event modal
  const [eventData, setEventData] = useState({ programme_name: '', description: '', start_date: '', end_date: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await ApiServices.getAllEvents(); // Use the ApiServices method
        setEvents(response);
        setFilteredEvents(response);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredEvents(events);
    } else if (filter === 'myEvents' && user?.role === 'organization') {
      setFilteredEvents(events.filter(event => event.organization_name === user?.name));
    }
  }, [filter, events, user]);

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const openCreateModal = (event=false) => {
    {event?setSelectedEvent(event):setSelectedEvent(eventData)}
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreateModalOpen(false);
    setEventData({ programme_name: '', description: '', start_date: '', end_date: '' }); // Clear form
  };

  const handleCreateEvent = async () => {
    try {
      const response = await ApiServices.createEvent(eventData)
      // After successful creation, fetch events again and close the modal
      console.log(eventData)
      setEvents([...events, response.data]);
      closeModal();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="bg-black text-white w-full min-h-screen">
      <Navbar />
      <div className="p-6">
      {user?.role === 'organization' && (
          <div className="text-end self-end mb-10">
            <button
              onClick={() => openCreateModal(false)}
              className="bg-dark-green font-bold text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Add Events
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.programme_id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">{event?.programme_name}</h3>
                <p className="text-gray-400 mb-2">Organizer: {event.organization_name}</p>
                <p className="text-gray-300">Start Date: {event?.start_date?.split("T")[0]}</p>
                <p className="text-gray-300">End Date: {event?.end_date?.split("T")[0]}</p>
                <p className="text-gray-400 mt-2">{event.description}</p>
                <button
                  onClick={() => openEventModal(event)}
                  className="bg-dark-green text-white px-4 py-2 mt-4 rounded-md hover:bg-green-700"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {isModalOpen && <EventModal event={selectedEvent} onEdit={openCreateModal} onClose={closeModal} user={user} navigate={navigate} />}

      {/* Create Event Modal */}
      {isCreateModalOpen && <CreateEventModal eventData={selectedEvent} setEventData={setEventData} onClose={closeModal} onCreate={handleCreateEvent} />}
    </div>
  );
};

const EventModal = ({ event, onClose, user, navigate, onEdit }) => {
    console.log(event)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{event?.programme_name}</h2>
          <button onClick={onClose} className="text-black text-lg font-bold">X</button>
        </div>
        <div className="mt-4">
          <p><strong>Organizer:</strong> {event?.organization_name}</p>
          <p><strong>Start Date:</strong> {event?.start_date?.split("T")[0]}</p>
          <p><strong>End Date:</strong> {event?.end_date?.split("T")[0]}</p>
          <p><strong>Description:</strong> {event?.description}</p>
          {user?.role === 'volunteer' && (
            <button className="bg-teal-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-teal-600">
              Register for Event
            </button>
          )}
          {user?.role === 'organization' && event?.organization_name === user?.name && (
            <button 
            onClick={()=>onEdit(event)}
             className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600">
              Edit Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateEventModal = ({ eventData, setEventData, onClose, onCreate }) => {
  const [imagePreview, setImagePreview] = useState(eventData.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEventData({ ...eventData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-2/3">
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
            onChange={(e) => setEventData({ ...eventData, programme_name: e.target.value })}
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
