import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApiServices from "../frontend-lib/api/ApiServices";
import { useStore } from "../store/store";
import { showToast } from "../utils/toasts";

export default function Signin() {
	const { user, setUser } = useStore();
	const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register forms
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		dob: "",
		role: "individual",
		gender: "male",
		phone: "",
		location: { lat: 27.7172, lng: 85.3240 }, // Default to Kathmandu, Nepal coordinates
		address: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const mapRef = useRef(null);
	const markerRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);

	// Check for valid token on component mount
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			console.log({ token });
			ApiServices.getUser()
				.then((user) => {
					setUser(user);
					navigate("/dashboard");
				})
				.catch(() => console.log("Invalid token or expired"));
		}
	}, [navigate]);

	// Load OpenStreetMap scripts
	useEffect(() => {
		if (!isLogin && !mapLoaded) {
			// Load Leaflet CSS
			const linkEl = document.createElement("link");
			linkEl.rel = "stylesheet";
			linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
			linkEl.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
			linkEl.crossOrigin = "";
			document.head.appendChild(linkEl);

			// Load Leaflet JS
			const scriptEl = document.createElement("script");
			scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
			scriptEl.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
			scriptEl.crossOrigin = "";
			scriptEl.onload = () => {
				setMapLoaded(true);
			};
			document.head.appendChild(scriptEl);
		}
	}, [isLogin, mapLoaded]);

	// Initialize map when scripts are loaded and component is in register mode
	useEffect(() => {
		if (!isLogin && mapLoaded && mapRef.current && !mapRef.current._leaflet_id) {
			const L = window.L;
			
			// Initialize the map
			const map = L.map(mapRef.current).setView(
				[formData.location.lat, formData.location.lng],
				13
			);
			
			// Add OpenStreetMap tiles
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);

			// Add a marker for the selected location
			const marker = L.marker([formData.location.lat, formData.location.lng], {
				draggable: true,
			}).addTo(map);
			
			markerRef.current = marker;
			
			// Handle marker drag events to update the location
			marker.on("dragend", function (event) {
				const position = marker.getLatLng();
				marker.setLatLng(position, { draggable: true });
				map.panTo(position);
				
				// Update location in form data
				setFormData((prev) => ({
					...prev,
					location: { lat: position.lat, lng: position.lng },
				}));
				
				// Get address from coordinates using Nominatim
				fetchAddressFromCoordinates(position.lat, position.lng);
			});
			
			// Handle map click events
			map.on("click", function (e) {
				marker.setLatLng(e.latlng);
				
				// Update location in form data
				setFormData((prev) => ({
					...prev,
					location: { lat: e.latlng.lat, lng: e.latlng.lng },
				}));
				
				// Get address from coordinates using Nominatim
				fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
			});
			
			// Initial address fetch
			fetchAddressFromCoordinates(formData.location.lat, formData.location.lng);
		}
	}, [isLogin, mapLoaded, formData.location.lat, formData.location.lng]);

	// Fetch address from coordinates using Nominatim
	const fetchAddressFromCoordinates = async (lat, lng) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
			);
			const data = await response.json();
			if (data && data.display_name) {
				setFormData((prev) => ({
					...prev,
					address: data.display_name,
				}));
			}
		} catch (error) {
			console.error("Error fetching address:", error);
		}
	};

	// Handle form field changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Handle form submission (login or register)
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let response;
			if (isLogin) {
				// Login request
				console.log(formData.email, formData.password);
				response = await ApiServices.login({
					email: formData.email,
					password: formData.password,
				});
			} else {
				// Register request (Ensure proper date format)
				const formattedDob = formData.dob
					? formData.dob?.split("T")[0]
					: "";
				response = await ApiServices.register({
					...formData,
					dob: formattedDob,
				});
				console.log({formData})
			}
			console.log(response);
			// Token is automatically stored in ApiServices, so no need to set it manually
			if (response) {
				navigate("/dashboard"); // Navigate to home page on successful login/registration
				showToast("Login successful", "success");
			} else showToast("Login failed", "error");
		} catch (err) {
			setError("Something went wrong, please try again.");
			console.error(err);
		}
	};

	return (
		<div className="flex h-screen bg-[#121212] w-screen">
			{/* Sidebar */}
			<div className="w-1/4 flex flex-col justify-center items-center p-8">
				<h1 className="absolute top-10 text-4xl text-dark-green font-bold justify-self-start">
					Sahayog
				</h1>
				<h1 className="text-3xl text-white font-bold justify-self-center">
					Welcome
				</h1>
				<p className="text-white mt-4 text-center">
					{isLogin
						? "Sign in to access your account."
						: "Create an account to get started."}
				</p>
			</div>

			{/* Main Content */}
			<div className="w-3/4 flex justify-center items-center overflow-y-auto max-h-screen py-8">
				<div className="bg-[#232323] max-h-[90%] overflow-auto scrollbar-hide p-10 rounded-xl shadow-xl w-full max-w-md border border-l-dark-green border-t-dark-green">
					<h1 className="text-3xl text-center mb-6 font-semibold text-white">
						{isLogin ? "Login" : "Register"}
					</h1>

					{error && (
						<p className="text-red-500 text-center mb-4">{error}</p>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{!isLogin && (
							<div className="flex items-center justify-between">
								<span className="text-sm text-white font-medium">
									Register as:
								</span>
								<div
									className={`w-24 h-8 flex items-center bg-white rounded-full p-1 cursor-pointer ${
										formData.role === "organization"
											? "justify-end"
											: "justify-start"
									}`}
									onClick={() =>
										setFormData((prev) => ({
											...prev,
											role:
												prev.role === "individual"
													? "organization"
													: "individual",
										}))
									}
								>
									<div className="w-10 h-6 bg-[#232323] rounded-full flex items-center justify-center text-xs text-white font-semibold">
										{formData.role === "individual"
											? "Ind"
											: "Org"}
									</div>
								</div>
							</div>
						)}

						{/* Common fields */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm text-white font-medium"
							>
								Email
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={formData.email}
								onChange={handleInputChange}
								required
								className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm text-white font-medium"
							>
								Password
							</label>
							<input
								type="password"
								name="password"
								id="password"
								value={formData.password}
								onChange={handleInputChange}
								required
								className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
							/>
						</div>

						{!isLogin && (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Fields for Individual */}
									{formData.role === "individual" && (
										<>
											<div>
												<label
													htmlFor="name"
													className="block text-sm text-white font-medium"
												>
													Full Name
												</label>
												<input
													type="text"
													name="name"
													id="name"
													value={formData.name}
													onChange={handleInputChange}
													required
													className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
												/>
											</div>
											<div>
												<label
													htmlFor="dob"
													className="block text-sm text-white font-medium"
												>
													Date of Birth
												</label>
												<input
													type="date"
													name="dob"
													id="dob"
													value={formData.dob}
													onChange={handleInputChange}
													required
													className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
												/>
											</div>
											<div>
												<label
													htmlFor="phone"
													className="block text-sm text-white font-medium"
												>
													Phone Number
												</label>
												<input
													type="tel"
													name="phone"
													id="phone"
													value={formData.phone}
													onChange={handleInputChange}
													required
													className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
												/>
											</div>
											<div className="col-span-2 flex items-center justify-between">
												<span className="text-sm text-white font-medium">
													Gender:
												</span>
												<div
													className={`w-32 h-8 flex items-center bg-white rounded-full p-1 cursor-pointer ${
														formData.gender === "female"
															? "justify-end"
															: "justify-start"
													}`}
													onClick={() =>
														setFormData((prev) => ({
															...prev,
															gender:
																prev.gender ===
																"male"
																	? "female"
																	: "male",
														}))
													}
												>
													<div className="w-12 h-6 bg-[#232323] rounded-full flex items-center justify-center text-xs text-white font-semibold">
														{formData.gender === "male"
															? "Male"
															: "Female"}
													</div>
												</div>
											</div>
										</>
									)}

									{/* Fields for Organization */}
									{formData.role === "organization" && (
										<>
											<div>
												<label
													htmlFor="organizationName"
													className="block text-sm text-white font-medium"
												>
													Organization Name
												</label>
												<input
													type="text"
													name="organizationName"
													id="organizationName"
													value={
														formData.organizationName
													}
													onChange={handleInputChange}
													required
													className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
												/>
											</div>
											<div>
												<label
													htmlFor="establishedDate"
													className="block text-sm text-white font-medium"
												>
													Established Date
												</label>
												<input
													type="date"
													name="establishedDate"
													id="establishedDate"
													value={formData.establishedDate}
													onChange={handleInputChange}
													required
													className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
												/>
											</div>
											<div>
												<label
													htmlFor="contactEmail"
													className="block text-sm text-white font-medium"
												>
													Contact Email
												</label>
												<input
													type="email"
													name="contactEmail"
													id="contactEmail"
													value={formData.contactEmail}
													onChange={handleInputChange}
													required
													className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
												/>
											</div>
											<div>
												<label
													htmlFor="contactPhone"
													className="block text-sm text-white font-medium"
												>
													Contact Phone
												</label>
												<input
													type="tel"
													name="contactPhone"
													id="contactPhone"
													value={formData.contactPhone}
													onChange={handleInputChange}
													required
													className="w-full p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
												/>
											</div>
										</>
									)}
								</div>

								{/* Location picker for both individual and organization */}
								<div className="mt-4">
									<label className="block text-sm text-white font-medium mb-2">
										Your Location
									</label>
									<div
										ref={mapRef}
										className="w-full h-48 border border-white rounded-md mb-2"
									></div>
									<div>
										<label
											htmlFor="address"
											className="block text-sm  text-white font-medium"
										>
											Address
										</label>
										<textarea
											name="address"
											id="address"
											value={formData.address}
											onChange={handleInputChange}
											readOnly
											className="w-full scrolbar-hide p-2 border border-white rounded-md bg-[#232323] text-white focus:outline-none focus:ring focus:ring-dark-green text-sm h-16"
										/>
										<p className="text-xs text-gray-400 mt-1">
											Click on the map or drag the marker to set your location
										</p>
									</div>
								</div>
							</>
						)}

						<button
							type="submit"
							className="w-full bg-white text-black p-2 rounded-md transition duration-300 hover:bg-opacity-90 text-sm"
						>
							{isLogin ? "Login" : "Register"}
						</button>
					</form>

					<div className="text-center mt-4">
						<span className="text-gray-400">
							{isLogin
								? "Don't have an account?"
								: "Already have an account?"}
						</span>
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="text-white underline ml-2"
						>
							{isLogin ? "Register" : "Login"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}