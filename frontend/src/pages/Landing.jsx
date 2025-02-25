import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Award, BarChart4, Clock, Heart } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const realEvents = [
    {
      id: 1,
      title: "Blood Donation Camp",
      description: "A successful blood donation drive that helped save hundreds of lives.",
      date: "2025-01-15",
      image: "https://www.nidirect.gov.uk/sites/default/files/images/news/blood-donation.jpg",
    },
    {
      id: 2,
      title: "Community Cleanliness Drive",
      description: "A dedicated effort to clean up local parks and streets, making our environment healthier.",
      date: "2025-02-10",
      image: "https://otterwaiver.com/wp-content/uploads/2021/03/young-man-cleaning-the-beach-VTN7W6U-scaled.jpg",
    },
    {
      id: 3,
      title: "Tree Plantation Program",
      description: "Planting trees to contribute to a greener future and combat climate change.",
      date: "2025-03-20",
      image: "https://cdn.downtoearth.org.in/library/large/2022-09-15/0.08976900_1663241450_istock-1248915720-(1).jpg",
    },
  ];
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const EventCard = ({ event, isCompleted = false }) => {

    
    return (
      <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
        <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg h-full transition-transform duration-300 hover:transform hover:scale-105 ${isCompleted ? 'opacity-90' : ''}`}>
          <div className="relative h-48">
            <img 
              src={event.image} 
              alt={event.title} 
              className={`w-full h-full object-cover ${isCompleted ? 'grayscale' : ''}`}
            />
          </div>
          <div className="p-5 flex flex-col h-56">
            <div className="mb-2">
              <h4 className="text-xl font-bold truncate">{event.title}</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">{formatDate(event.date)}</p>
            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>
            <button 
              className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-300 mt-auto ${isCompleted ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              onClick={() => navigate(`/event/${event.id}`)}
            >
              {isCompleted ? 'View Recap' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header/Navigation */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="text-red-500" size={28} />
            <span className="text-2xl font-bold">Sahayog</span>
          </div>
      
          <div className="flex space-x-4">
            <button 
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Empower Your Impact. Connect. Volunteer. Inspire.
            </h1>
            <p className="text-xl text-gray-300 mb-8">
            Join a community of change-makers and manage your volunteer efforts effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                className="px-8 py-3 bg-blue-600 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors"
                onClick={() => navigate('/demo')}
              >
                Join Now <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center">
              <Users className="text-blue-500" size={50} />
              <h3 className="text-4xl font-bold mt-4">10,000+</h3>
              <p className="text-gray-300">Total Volunteers Registered</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="text-blue-500" size={50} />
              <h3 className="text-4xl font-bold mt-4">500+</h3>
              <p className="text-gray-300">Events Organized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className='px-6 py-20'>
      <div className="max-w-6xl mx-auto mt-12 mb-10 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Successful Events</h2>
            <div className="flex flex-wrap -mx-3">
              {realEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
              </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Volunteer Program?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of organizations making a bigger impact with VolunteerHub.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              className="px-8 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/signup')}
            >
              Register As an Organization
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 border-t border-gray-800">
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


export default Landing;