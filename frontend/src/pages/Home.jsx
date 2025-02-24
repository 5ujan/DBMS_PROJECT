import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav';
import { useStore } from '../store/store';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [events, setEvents] = useState([]);

  

  useEffect(() => {
    // Predefined event data
    const realEvents = [
      {
        id: 1,
        title: "Blood Donation Camp",
        description: "A successful blood donation drive that helped save hundreds of lives.",
        date: "2024-01-15",
        image: "https://www.nidirect.gov.uk/sites/default/files/images/news/blood-donation.jpg",
      },
      {
        id: 2,
        title: "Community Cleanliness Drive",
        description: "A dedicated effort to clean up local parks and streets, making our environment healthier.",
        date: "2024-02-10",
        image: "https://otterwaiver.com/wp-content/uploads/2021/03/young-man-cleaning-the-beach-VTN7W6U-scaled.jpg",
      },
      {
        id: 3,
        title: "Tree Plantation Program",
        description: "Planting trees to contribute to a greener future and combat climate change.",
        date: "2024-03-20",
        image: "https://cdn.downtoearth.org.in/library/large/2022-09-15/0.08976900_1663241450_istock-1248915720-(1).jpg",
      },
      {
        id: 4,
        title: "Food Distribution Drive",
        description: "Providing meals to underprivileged families in our community.",
        date: "2024-04-05",
        image: "https://imgnew.outlookindia.com/public/uploads/articles/2021/2/13/Food-distribution_20200825.jpg",
      },
      {
        id: 5,
        title: "Educational Workshop",
        description: "A program to support education and skill development for young learners.",
        date: "2024-05-12",
        image: "https://www.worcester.ac.uk/images/text-area-images/mpc-workshops2.JPG?width=880",
      },
      {
        id: 6,
        title: "Health Awareness Campaign",
        description: "Promoting health and wellness through free check-ups and awareness sessions.",
        date: "2024-06-25",
        image: "https://ekarmachari.com/wp-content/uploads/2021/05/242303958fchv.jpeg",
      }
    ];
    setEvents(realEvents);
  }, []);

  return (
    <div className="bg-black text-white w-full min-h-screen">
      <Navbar />
      <div className="p-6">
        
        <h2 className="text-5xl font-medium text-center mt-4 text-gray-300">
          "Together, we can make a difference."
        </h2>

        <h3 className="text-3xl font-semibold text-center mt-6 text-white">
          Our Successful Events
        </h3>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mt-3">{event.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{event.date}</p>
              <p className="text-gray-300 mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
