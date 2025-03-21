import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends, FaBuilding, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";

const Dashboard = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    organizations: 0,
    events: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const data = await ApiServices.adminGetStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Volunteers",
      count: stats.volunteers,
      icon: <FaUserFriends className="text-blue-100" size={32} />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      link: "/admin/volunteers",
      buttonText: "Manage Volunteers",
    },
    {
      title: "Organizations",
      count: stats.organizations,
      icon: <FaBuilding className="text-green-100" size={32} />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      link: "/admin/organizations",
      buttonText: "Manage Organizations",
    },
    {
      title: "Events",
      count: stats.events,
      icon: <FaCalendarAlt className="text-purple-100" size={32} />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      link: "/admin/events",
      buttonText: "Manage Events",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <IoIosArrowBack />
              <span>Back to Normal Mode</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <FaChartLine className="text-white" />
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-lg shadow-lg overflow-hidden`}
            >
              <div className="p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium opacity-90">{card.title}</p>
                    {isLoading ? (
                      <div className="h-8 w-12 bg-white/20 animate-pulse rounded mt-1"></div>
                    ) : (
                      <h2 className="text-3xl font-bold">{card.count}</h2>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                    {card.icon}
                  </div>
                </div>
                <Link
                  to={card.link}
                  className="block w-full text-center py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors text-white font-medium mt-4"
                >
                  {card.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity or Additional Content */}
      </div>
    </div>
  );
};

export default Dashboard;