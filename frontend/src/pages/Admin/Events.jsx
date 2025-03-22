import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoMdCalendar, IoMdMail } from "react-icons/io";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import {
	FaUserFriends,
	FaBuilding,
	FaCalendarAlt,
	FaSearch,
	FaEye,
	FaTrashAlt,
	FaFilter,
} from "react-icons/fa";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";
import LocationEditorSection from "../../components/LocationPicker"; // Adjust the import path as needed

const ManageEvents = () => {
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [showLocationFilter, setShowLocationFilter] = useState(false);
	const [userLocation, setUserLocation] = useState({
		lat: 27.7172,
		lng: 85.324,
	});
	const [userAddress, setUserAddress] = useState("");
	const [maxDistance, setMaxDistance] = useState(50); // Default 50 km radius
	const [isFilteringByLocation, setIsFilteringByLocation] = useState(false);

	const navigate = useNavigate();

	const fetchEvents = async () => {
		setLoading(true);
		try {
			const response = await ApiServices.getAllEvents();

			// Simulate location data for events if they don't have it
			// In a real app, you would have this data from the API
			// const eventsWithLocation = response.map((event) => ({
			// 	...event,
			// 	location: event.location || {
			// 		lat: parseFloat(
			// 			(Math.random() * (28.3 - 27.1) + 27.1).toFixed(6)
			// 		),
			// 		lng: parseFloat(
			// 			(Math.random() * (85.9 - 84.7) + 84.7).toFixed(6)
			// 		),
			// 	},
			// }));

			setEvents(response);
			setFilteredEvents(response);
		} catch (error) {
			console.error("Error fetching events:", error);
			showToast("Failed to load events");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	// Filter events based on search term and location
	useEffect(() => {
		let filtered = [...events];

		// Text search filter
		if (searchTerm.trim() !== "") {
			filtered = filtered.filter(
				(event) =>
					event.programme_name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					event.organization_name
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			);
		}

		// Location-based filter
		if (isFilteringByLocation && userLocation.lat && userLocation.lng) {
			filtered = filtered.filter((event) => {
				if (
					!event.location ||
					!event.location.lat ||
					!event.location.lng
				) {
					return false;
				}

				const distance = calculateDistance(
					userLocation.lat,
					userLocation.lng,
					event.location.lat,
					event.location.lng
				);

				// Filter by maximum distance (km)
				return distance <= maxDistance;
			});
		}

		setFilteredEvents(filtered);
	}, [searchTerm, events, isFilteringByLocation, userLocation, maxDistance]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleLocationUpdate = ({ location, address }) => {
		setUserLocation(location);
		setUserAddress(address);
	};

	const toggleLocationFilter = () => {
		setShowLocationFilter(!showLocationFilter);
	};

	const applyLocationFilter = () => {
		setIsFilteringByLocation(true);
		setShowLocationFilter(false);
		showToast(
			`Showing events within ${maxDistance}km of selected location`
		);
	};

	const clearLocationFilter = () => {
		setIsFilteringByLocation(false);
		showToast("Location filter cleared");
	};

	// Calculate distance between two coordinates in kilometers (using Haversine formula)
	const calculateDistance = (lat1, lon1, lat2, lon2) => {
		const R = 6371; // Radius of the earth in km
		const dLat = deg2rad(lat2 - lat1);
		const dLon = deg2rad(lon2 - lon1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) *
				Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; // Distance in km
		return distance;
	};

	const deg2rad = (deg) => {
		return deg * (Math.PI / 180);
	};

	const handlePreviewEvent = (event) => {
		console.log(event);
		setSelectedEvent(event);
	};

	const handleClosePreview = () => {
		setSelectedEvent(null);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const handleDeleteEvent = async (eventId) => {
		if (window.confirm("Are you sure you want to delete this event?")) {
			try {
				// Replace with the actual API call to delete an event
				// await ApiServices.deleteEvent(eventId);
				showToast("Event deleted successfully");
				// Remove the event from the state
				setEvents(
					events.filter((event) => event.programme_id !== eventId)
				);
				setFilteredEvents(
					filteredEvents.filter(
						(event) => event.programme_id !== eventId
					)
				);
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
							to="/admin"
							className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg shadow-sm hover:bg-gray-700 transition-colors"
						>
							<IoIosArrowBack />
							<span>Back to Dashboard</span>
						</Link>
					</div>
					<div className="flex items-center gap-2">
						<FaCalendarAlt className="text-purple-400" />
						<h1 className="text-xl font-bold text-white">
							Manage Events
						</h1>
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
						<h2 className="text-lg font-semibold text-white">
							All Events
						</h2>
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

							{/* Location filter button */}
							<button
								onClick={toggleLocationFilter}
								className={`px-3 py-1 text-gray-200 rounded transition-colors text-sm flex items-center gap-1 ${
									isFilteringByLocation
										? "bg-purple-600 hover:bg-purple-700"
										: "bg-gray-700 hover:bg-gray-600"
								}`}
								title={
									isFilteringByLocation
										? "Currently filtering by location"
										: "Filter by location"
								}
							>
								<FaMapMarkerAlt />
								<span>Location</span>
							</button>

							{isFilteringByLocation && (
								<button
									onClick={clearLocationFilter}
									className="px-3 py-1 bg-red-600 text-gray-200 rounded hover:bg-red-700 transition-colors text-sm"
									title="Clear location filter"
								>
									Clear Filter
								</button>
							)}

							<button
								onClick={fetchEvents}
								className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
							>
								Refresh
							</button>
						</div>
					</div>

					{/* Location filter panel */}
					{showLocationFilter && (
						<div className="p-4 bg-gray-750 border-b border-gray-700">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="md:col-span-2">
									<LocationEditorSection
										isEditing={true}
										user={{
											location: userLocation,
											address: userAddress,
										}}
										onLocationUpdate={handleLocationUpdate}
									/>
								</div>
								<div className="flex flex-col justify-between bg-gray-800 p-4 rounded-xl">
									<div>
										<h3 className="text-lg font-semibold text-white mb-4">
											Filter Settings
										</h3>
										<div className="mb-4">
											<label className="block text-sm text-gray-300 font-medium mb-1">
												Maximum Distance (km)
											</label>
											<input
												type="range"
												min="1"
												max="500"
												value={maxDistance}
												onChange={(e) =>
													setMaxDistance(
														parseInt(e.target.value)
													)
												}
												className="w-full"
											/>
											<div className="flex justify-between text-xs text-gray-400">
												<span>1km</span>
												<span>{maxDistance}km</span>
												<span>500km</span>
											</div>
										</div>

										{userAddress && (
											<div className="mb-4">
												<h4 className="text-sm font-medium text-gray-300 mb-1">
													Selected Location:
												</h4>
												<p className="text-xs text-gray-400">
													{userAddress}
												</p>
											</div>
										)}
									</div>

									<div className="flex mt-4 gap-2">
										<button
											onClick={() =>
												setShowLocationFilter(false)
											}
											className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
										>
											Cancel
										</button>
										<button
											onClick={applyLocationFilter}
											className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
										>
											Apply Filter
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

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
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
												Event Name
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
												Organization
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
												Date
											</th>
											{isFilteringByLocation && (
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
													Distance
												</th>
											)}
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-gray-800 divide-y divide-gray-700">
										{filteredEvents.map((event) => {
											const distance =
												event.location &&
												userLocation.lat &&
												userLocation.lng
													? calculateDistance(
															userLocation.lat,
															userLocation.lng,
															event.location.lat,
															event.location.lng
													  ).toFixed(1)
													: null;

											return (
												<tr
													key={event.programme_id}
													className="hover:bg-gray-750"
												>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
														{event.programme_name}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
														{
															event.organization_name
														}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
														{formatDate(
															event.start_date
														)}{" "}
														-{" "}
														{formatDate(
															event.end_date
														)}
													</td>
													{isFilteringByLocation && (
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
															{distance
																? `${distance} km`
																: "Unknown"}
														</td>
													)}
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														<div className="flex gap-2">
															<button
																onClick={() =>
																	handlePreviewEvent(
																		event
																	)
																}
																className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
																title="Preview"
															>
																<FaEye />
															</button>
															<button
																onClick={() =>
																	handleDeleteEvent(
																		event.programme_id
																	)
																}
																className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
																title="Delete"
															>
																<FaTrashAlt />
															</button>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							) : (
								<div className="p-8 text-center text-gray-400">
									{isFilteringByLocation
										? "No events found within the selected distance"
										: searchTerm
										? "No events match your search"
										: "No events found"}
								</div>
							)}
						</div>
					)}
				</div>

				{/* Event Preview Modal */}
				{selectedEvent && (
					<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
						<div className="bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] scrollbar-hide overflow-y-auto">
							<div className="border-b border-gray-700 p-4 flex justify-between items-center">
								<h2 className="text-xl font-bold text-white">
									Event Preview
								</h2>
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
									<h3 className="text-2xl font-bold text-white mb-2">
										{selectedEvent.programme_name}
									</h3>
									<div className="flex items-center text-purple-400 mb-4">
										<IoMdCalendar className="mr-2" />
										<span>
											{formatDate(
												selectedEvent.start_date
											)}{" "}
											-{" "}
											{formatDate(selectedEvent.end_date)}
										</span>
									</div>

									{/* Show location information in preview */}
									{selectedEvent.location && (
										<div className="flex items-center text-green-400 mb-4">
											<FaMapMarkerAlt className="mr-2" />
											<span>
												Location:{" "}
												{selectedEvent.address || "Unknown"}
												{userLocation.lat &&
													userLocation.lng && (
														<span className="ml-2 text-sm text-gray-400">
															(
															{calculateDistance(
																userLocation.lat,
																userLocation.lng,
																Number(
																	selectedEvent
																		.location
																		.lat
																),
																Number(
																	selectedEvent
																		.location
																		.lng
																)
															).toFixed(1)}{" "}
															km away)
														</span>
													)}
											</span>
										</div>
									)}

									<p className="text-gray-300 mb-4">
										{selectedEvent.description}
									</p>
								</div>

								<div className="bg-gray-750 rounded-lg p-4 mb-4">
									<h4 className="text-lg font-semibold text-white mb-2">
										Organization Details
									</h4>
									<p className="text-gray-300 mb-1">
										<span className="font-medium">
											Name:
										</span>{" "}
										{selectedEvent.organization_name}
									</p>
									<p className="text-gray-300 mb-1">
										<span className="font-medium">ID:</span>{" "}
										{selectedEvent.organization_id}
									</p>
								</div>

								<div className="bg-gray-750 rounded-lg p-4">
									<h4 className="text-lg font-semibold text-white mb-2">
										Contact Information
									</h4>
									<div className="flex items-center text-gray-300 mb-2">
										<IoMdMail className="mr-2" />
										<span>
											{selectedEvent.contact_email}
										</span>
									</div>
									<div className="flex items-center text-gray-300">
										<FaPhone className="mr-2" />
										<span>
											{selectedEvent.contact_phone}
										</span>
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
										handleDeleteEvent(
											selectedEvent.programme_id
										);
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
