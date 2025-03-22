import { useState, useEffect, useRef } from "react";
import ApiServices from "../frontend-lib/api/ApiServices"; // Adjust path as needed

const LocationEditorSection = ({isEditing, user, onLocationUpdate }) => {
    if(!user.location.lat||!user.location.lng) return 

  const [location, setLocation] = useState(user?.location || { lat: 27.7172, lng: 85.3240 });
  const [address, setAddress] = useState(user?.address || "");
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Load OpenStreetMap scripts when component mounts
  useEffect(() => {
    if (!mapLoaded) {
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
  }, [mapLoaded]);

  // Initialize map when editing is enabled and scripts are loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapRef.current._leaflet_id) {
      const L = window.L;
      
      // Initialize the map
      const map = L.map(mapRef.current).setView(
        [location?.lat, location?.lng],
        13
      );
      
      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add a marker for the selected location
      const marker = L.marker([location.lat, location.lng], {
        draggable: true,
      }).addTo(map);
      
      markerRef.current = marker;
      
      // Handle marker drag events to update the location
      marker.on("dragend", function (event) {
        const position = marker.getLatLng();
        marker.setLatLng(position, { draggable: true });
        map.panTo(position);
        
        // Update location state
        setLocation({ lat: position.lat, lng: position.lng });
        
        // Get address from coordinates using Nominatim
        fetchAddressFromCoordinates(position.lat, position.lng);
      });
      
      // Handle map click events
      map.on("click", function (e) {
       marker.setLatLng(e.latlng);
        
        // Update location state
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        
        // Get address from coordinates using Nominatim
        fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
      });
      
      // Initial address fetch if needed
      if (!address) {
        fetchAddressFromCoordinates(location.lat, location.lng);
      }

      // Trigger a resize after a short delay to ensure proper map rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [ mapLoaded, location.lat, location.lng, address]);


  useEffect(()=>{
  if(isEditing){
    onLocationUpdate({location, address})}
  },[location, address])
  // Fetch address from coordinates using Nominatim
  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Save updated location to the backend
  const saveLocation = async () => {
    try {
      // Assuming your API service has an updateUserLocation method
      console.log(location, address)
      // Notify parent component if callback provided
      if (onLocationUpdate) {
        onLocationUpdate({ location, address });
      }
      
    } catch (error) {
      console.error("Error saving location:", error);
      // You might want to add error handling UI here
    }
  };

  return (
    <section className="bg-gray-800 w-full mt-4 rounded-xl pr-1 pb-1 text-white">
      <div className="bg-gray-700 p-8 rounded-xl h-full shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Your Location</h3>
            {/* <div className="flex gap-2">
              <button 
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={saveLocation}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Save
              </button>
            </div> */}
       
        </div>
        
          <div className="mt-4">
            <div 
              ref={mapRef}
              className="w-full h-64 border border-gray-600 rounded-md mb-4"
            ></div>
            <div>
              <label className="block text-sm text-gray-300 font-medium mb-1">
                Address
              </label>
              <textarea
                value={address}
                readOnly
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring focus:ring-green-500 text-sm h-20"
              />
              <p className="text-xs text-gray-400 mt-1">
                Click on the map or drag the marker to set your location
              </p>
            </div>
          </div>

      </div>
    </section>
  );
};

export default LocationEditorSection;