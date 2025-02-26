import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav';
import { useStore } from '../store/store';
import ApiServices from '../frontend-lib/api/ApiServices';
import {  Heart } from 'lucide-react';


const Home = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOPen, setIsOpen] = useState(false);
      useEffect(() => {
        // Predefined event data (updated to 2025)
        (async () => {
          console.log("enters")
          const data = await ApiServices.getMyEvents()
          console.log({fetcedEvents:data})
          // Get current date (start of day)
          const today = new Date();
          
    // Filter and sort upcoming events (limit to 3)
    const upcoming = data
      .filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA - dateB;
      })
      .slice(0, 3);
    
    // Filter and sort completed events (most recent first, limit to 3)
    const completed = data
      .filter(event => {
        const eventDate = new Date(event.end_date);
        return eventDate < today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.end_date);
        const dateB = new Date(b.end_date);
        return dateB - dateA; // Reverse order for completed events
      })
      .slice(0, 3);
    
      const ongoing = data
      .filter(event => {
        const eventDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        return eventDate <= today && endDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateB - dateA; // Reverse order for completed events
      })
      .slice(0, 3);
    setUpcomingEvents(upcoming);
    setCompletedEvents(completed);
    setOngoingEvents(ongoing);
  })();
  }, []);

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setIsOpen(false);
  };

  // Function to determine event status
  const getEventStatus = (eventDate,end_date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(eventDate);
    const endDate = new Date(end_date);

    if (endDate < today) {
      return { status: "Completed", color: "bg-gray-600", textColor: "text-white" };
    }
    if (date <= today && endDate >= today) {
      return { status: "Ongoing", color: "bg-blue-600", textColor: "text-white" };
    }
    
    // Calculate difference in days
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffTime < 0) {
      return { status: "Completed", color: "bg-gray-600", textColor: "text-white" };
    } else if (diffDays === 0) {
      return { status: "Today", color: "bg-red-600", textColor: "text-white" };
    } else if (diffDays <= 7) {
      return { status: "This Week", color: "bg-orange-500", textColor: "text-white" };
    } else if (diffDays <= 30) {
      return { status: "This Month", color: "bg-blue-500", textColor: "text-white" };
    } else {
      return { status: "Upcoming", color: "bg-green-600", textColor: "text-white" };
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    console.log({dateString})
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log("At HOme:",user)
  // Reusable event card component
  const EventCard = ({ event, isCompleted = false }) => {

    const { status, color, textColor } = getEventStatus(event.start_date,event.end_date);
    
    return (
      <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
        <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg h-full transition-transform duration-300 hover:transform hover:scale-105 ${isCompleted ? 'opacity-90' : ''}`}>
          <div className="relative h-48">
            <img 
              src={event.image} 
              alt={event.title} 
              className={`w-full h-full object-cover ${isCompleted ? 'grayscale' : ''}`}
            />
            <div className={`absolute top-0 right-0 ${color} ${textColor} px-3 py-1 m-2 rounded-full text-sm font-semibold`}>
              {status}
            </div>
          </div>
          <div className="p-5 flex flex-col h-56">
            <div className="mb-2">
              <h4 className="text-xl font-bold truncate">{event.programme_name}</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">{formatDate(event.start_date)} -  {formatDate(event.end_date)}</p>
            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>
            <button 
              className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-300 mt-auto ${isCompleted ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-dark-green hover:bg-[#137863] text-white'}`}
              onClick={() =>openEventModal(event)}
            >
              {isCompleted ? 'View Recap' : 'View Details'}
            </button>
          </div>
        </div>
        {isOPen && selectedEvent && (
          <EventModal event={selectedEvent} onClose={closeEventModal} />
        )}
      </div>
    );
  };

  return (
    <div className="bg-black text-white w-full min-h-screen">
      <Navbar />
      <div className="p-6">
        <h2 className="text-5xl font-medium text-center mt-4 text-gray-300">
          "Together, we can make a difference."
        </h2>

        {/* Upcoming Events Section */}
        <div className="max-w-6xl mx-auto mt-12 mb-10">
          <h3 className="text-3xl font-semibold text-white mb-6">
            Ongoing {user?.role!=="organization"?"Registered":""} Events
          </h3>
          
          {ongoingEvents.length > 0 ? (
            <div className="flex flex-wrap -mx-3">
              {ongoingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-8">
              <p className="text-xl text-gray-400">No ongoing events at the moment.</p>
            </div>
          )}
        </div>
        {/* Upcoming Events Section */}
        <div className="max-w-6xl mx-auto mt-12 mb-10">
          <h3 className="text-3xl font-semibold text-white mb-6">
            Upcoming {user?.role!=="organization"?"Registered":""} Events
          </h3>
          
          {upcomingEvents.length > 0 ? (
            <div className="flex flex-wrap -mx-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-8">
              <p className="text-xl text-gray-400">No upcoming events at the moment.</p>
              <p className="text-gray-500 mt-2">Check back soon!</p>
            </div>
          )}
        </div>
        
        {/* Completed Events Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h3 className="text-3xl font-semibold text-white mb-6">
            Completed Events
          </h3>
          
          {completedEvents.length > 0 ? (
            <div className="flex flex-wrap -mx-3">
              {completedEvents.map((event) => (
                <EventCard key={event.id} event={event} isCompleted={true} />
              ))}
            </div>
          ) : (
            <div className="py-8">
              <p className="text-xl text-gray-400">No completed events yet.</p>
            </div>
          )}
          
        </div>
      </div>
      <footer className="px-6 py-12 bg-gray-900 bg-opacity-25 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Webinars</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">GDPR</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="text-red-500" size={24} />
              <span className="text-xl font-bold">Sahayog</span>
            </div>
            <p className="text-gray-400">© 2025 Sahayog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const EventModal = ({ event, onClose}) => {
  const handleRegister = async () => {
    try {
      const response = await ApiServices.registerVolunteer(event.programme_id);
      if (response) {
        showToast('Registered successfully!');
        // navigate('/profile');
      } else {
        alert('Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

    console.log(event)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[90%] h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{event?.programme_name}</h2>
          <button onClick={onClose} className="text-black text-lg font-bold">X</button>
        </div>
        {event?.image && (
          <div className="mb-4 w-56 h-56 overflow-hidden">
            <img src={event.image} alt="Event" className="w-full h-full object-contain rounded" />
          </div>
        )}
        <div className="mt-4">
          <p><strong>Organizer:</strong> {event?.organization_name}</p>
          <p><strong>Start Date:</strong> {event?.start_date?.split("T")[0]}</p>
          <p><strong>End Date:</strong> {event?.end_date?.split("T")[0]}</p>
          <p><strong>Description:</strong> {event?.description}</p>
          
        </div>
      </div>
    </div>
  );
};

export default Home;