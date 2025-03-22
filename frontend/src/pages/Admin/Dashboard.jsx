import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserFriends, FaBuilding, FaCalendarAlt, FaChartLine, FaMapMarkedAlt, FaFilter } from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";

const Dashboard = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    organizations: 0,
    events: 0,
  });
  const [isLoadingVar, setIsLoading] = useState(true);
  const [volunteerLocation, setVolunteerLocations] = useState([]);
  const [organizationLocation, setOrganizationLocations] = useState([]);
  const [eventLocation, setEventLocations] = useState([]);
  const [mapLoadedBool, setMapLoaded] = useState(false);
  const [viewModevar, setViewMode] = useState("all"); // "all", "volunteers", "organizations", "events"
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  
  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const data = await ApiServices.adminGetStats();
        setStats(data);
        
        // Fetch volunteer locations
        const volunteers = await ApiServices.adminGetAllVolunteers();
        const validVolunteerLocations = volunteers
          .filter(volunteer => volunteer.location && volunteer.location.lat && volunteer.location.lng)
          .map(volunteer => ({
            ...volunteer.location,
            type: 'volunteer',
            name: volunteer.name || 'Volunteer',
            id: volunteer.id,
            email: volunteer.email,
            phone: volunteer.phone
          }));
        setVolunteerLocations(validVolunteerLocations);
        
        // Fetch organization locations
        const organizations = await ApiServices.adminGetAllOrganizations();
        const validOrganizationLocations = organizations
          .filter(org => org.location && org.location.lat && org.location.lng)
          .map(org => ({
            ...org.location,
            type: 'organization',
            name: org.name || 'Organization',
            id: org.id,
            address: org.address,
            contactPerson: org.contactPerson
          }));
        setOrganizationLocations(validOrganizationLocations);
        
        // Fetch event locations
        const events = await ApiServices.adminGetAllEvents();
        const validEventLocations = events
          .filter(event => event.location && event.location.lat && event.location.lng)
          .map(event => ({
            ...event.location,
            type: 'event',
            name: event.title || 'Event',
            id: event.id,
            description: event.description,
            date: event.date
          }));
        setEventLocations(validEventLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Load Leaflet scripts
  useEffect(() => {
    if (!mapLoadedBool) {
      // Load Leaflet CSS if not already loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        linkEl.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        linkEl.crossOrigin = "";
        document.head.appendChild(linkEl);
      }

      // Load Leaflet JS if not already loaded
      if (!window.L) {
        const scriptEl = document.createElement("script");
        scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        scriptEl.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        scriptEl.crossOrigin = "";
        scriptEl.onload = () => {
          setMapLoaded(true);
        };
        document.head.appendChild(scriptEl);
      } else {
        setMapLoaded(true);
      }
    }
  }, []);

  // Initialize map when data is loaded and Leaflet is ready
  useEffect(() => {
    if (mapLoadedBool && mapRef.current && !mapRef.current._leaflet_id) {
      const L = window.L;
      
      // Default center if no locations
      let mapCenter = [27.7172, 85.3240]; // Default coordinates
      let zoomLevel = 10;
      
      // Initialize the map
      const map = L.map(mapRef.current).setView(mapCenter, zoomLevel);
      mapInstanceRef.current = map;
      
      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      
      // Create markers layer group
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      
      // Add legend
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
          <div style="background-color: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px; font-size: 12px;">
            <div style="margin-bottom: 5px; display: flex; align-items: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #3b82f6; margin-right: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">V</div>
              <span>Volunteers</span>
            </div>
            <div style="margin-bottom: 5px; display: flex; align-items: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #10b981; margin-right: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">O</div>
              <span>Organizations</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #8b5cf6; margin-right: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">E</div>
              <span>Events</span>
            </div>
          </div>
        `;
        return div;
      };
      legend.addTo(map);
      
      // Trigger a resize after a short delay to ensure proper map rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [mapLoadedBool]);

  // Update markers based on viewMode
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !mapLoadedBool) return;
    
    const L = window.L;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    
    // Clear all existing markers
    markersLayer.clearLayers();
    
    // Determine which location sets to show based on viewMode
    let locationsToShow = [];
    if (viewModevar === 'all' || viewModevar === 'volunteers') {
      locationsToShow = [...locationsToShow, ...volunteerLocation];
    }
    if (viewModevar === 'all' || viewModevar === 'organizations') {
      locationsToShow = [...locationsToShow, ...organizationLocation];
    }
    if (viewModevar === 'all' || viewModevar === 'events') {
      locationsToShow = [...locationsToShow, ...eventLocation];
    }
    
    // Don't proceed if no locations to show
    if (locationsToShow.length === 0) return;
    
    // Create improved markers
    locationsToShow.forEach(loc => {
      let markerHtml = '';
      let popupContent = '';
      
      if (loc.type === 'volunteer') {
        markerHtml = `
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #3b82f6; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
            V
          </div>
        `;
        popupContent = `
          <div style="min-width: 180px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${loc.name}</h3>
            <p style="margin: 0; padding: 0; color: #3b82f6; font-weight: 500;">Volunteer</p>
            ${loc.email ? `<p style="margin: 5px 0;">Email: ${loc.email}</p>` : ''}
            ${loc.phone ? `<p style="margin: 5px 0;">Phone: ${loc.phone}</p>` : ''}
          </div>
        `;
      } else if (loc.type === 'organization') {
        markerHtml = `
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #10b981; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
            O
          </div>
        `;
        popupContent = `
          <div style="min-width: 180px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${loc.name}</h3>
            <p style="margin: 0; padding: 0; color: #10b981; font-weight: 500;">Organization</p>
            ${loc.address ? `<p style="margin: 5px 0;">Address: ${loc.address}</p>` : ''}
            ${loc.contactPerson ? `<p style="margin: 5px 0;">Contact: ${loc.contactPerson}</p>` : ''}
          </div>
        `;
      } else if (loc.type === 'event') {
        markerHtml = `
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #8b5cf6; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
            E
          </div>
        `;
        popupContent = `
          <div style="min-width: 180px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${loc.name}</h3>
            <p style="margin: 0; padding: 0; color: #8b5cf6; font-weight: 500;">Event</p>
            ${loc.date ? `<p style="margin: 5px 0;">Date: ${new Date(loc.date).toLocaleDateString()}</p>` : ''}
            ${loc.description ? `<p style="margin: 5px 0;">${loc.description.substring(0, 100)}${loc.description.length > 100 ? '...' : ''}</p>` : ''}
          </div>
        `;
      }
      
      if (markerHtml) {
        const iconVar = L.divIcon({
          className: 'custom-div-icon',
          html: markerHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        
        const marker = L.marker([loc.lat, loc.lng], { icon: iconVar }).addTo(markersLayer);
        marker.bindPopup(popupContent);
      }
    });
    
    // Fit map to show all visible markers with padding
    if (locationsToShow.length > 0) {
      const bounds = [];
      locationsToShow.forEach(loc => {
        bounds.push([loc.lat, loc.lng]);
      });
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [viewModevar, volunteerLocation, organizationLocation, eventLocation, mapLoadedBool]);

  const card = [
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

  const viewModes = [
    { id: "all", label: "All Data", count: volunteerLocation.length + organizationLocation.length + eventLocation.length },
    { id: "volunteers", label: "Volunteers", count: volunteerLocation.length },
    { id: "organizations", label: "Organizations", count: organizationLocation.length },
    { id: "events", label: "Events", count: eventLocation.length },
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
          {card.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-lg shadow-lg overflow-hidden`}
            >
              <div className="p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium opacity-90">{card.title}</p>
                    {isLoadingVar ? (
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

        {/* Map Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <FaMapMarkedAlt className="text-white" />
                  <h2 className="text-xl font-bold">Location Overview</h2>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {viewModevar === "all" ? 
                    `Showing ${volunteerLocation.length} volunteers, ${organizationLocation.length} organizations, and ${eventLocation.length} events`
                    : viewModevar === "volunteers" ? 
                    `Showing ${volunteerLocation.length} volunteers`
                    : viewModevar === "organizations" ?
                    `Showing ${organizationLocation.length} organizations`
                    : `Showing ${eventLocation.length} events`
                  }
                </p>
              </div>
              
              {/* View Mode Filter */}
              <div className="flex gap-2 items-center">
                <FaFilter className="text-gray-400" />
                <div className="flex bg-gray-700 rounded-lg overflow-hidden">
                  {viewModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        viewModevar === mode.id
                          ? "bg-gray-600 text-white"
                          : "text-gray-300 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {mode.label} ({mode.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map Container */}
            <div 
              ref={mapRef}
              className="w-full h-96 bg-gray-700 rounded-lg overflow-hidden"
            >
              {!mapLoadedBool || (
                volunteerLocation.length === 0 && 
                organizationLocation.length === 0 && 
                eventLocation.length === 0
              ) ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-700">
                  {isLoadingVar ? (
                    <div className="text-gray-400">Loading map data...</div>
                  ) : (
                    <div className="text-gray-400">No location data available</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;