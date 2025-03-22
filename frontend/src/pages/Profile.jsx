import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import ApiServices from "../frontend-lib/api/ApiServices";
import { FiEdit, FiSave, FiTrash, FiUpload, FiXCircle } from "react-icons/fi";
import Navbar from "../components/Nav";
import LocationEditorSection from "../components/LocationPicker";

const ProfilePage = () => {
	const [profileData1, setProfileData] = useState({
		name: "",
		email: "",
		role: "",
		avatar: "",
		created_at: "",
		skills: [],
	});
	const [isEditingbool, setIsEditing] = useState(false);
	const [imagePreviewVar, setImagePreview] = useState(null);
	const [newSkillVar, setNewSkill] = useState("");
	const [availableSkillsVar, setAvailableSkills] = useState([]);
	const [loadingVar, setLoading] = useState(true);
	const { user: users, setUser } = useStore();
	const [event, setEvents] = useState([]);
	const [donationss, setDonations] = useState([]);
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const data = await ApiServices.getUser();
				const skills = await ApiServices.getAllSkills();
				const events = await ApiServices.getEventsByOrganization(
					data?.id
				);
				const d = await ApiServices.getDonationsByOrganization(
					data?.id
				);
				console.log(d);
				setDonations(d);
				setAvailableSkills(skills);
				setEvents(events);
				setProfileData({
					...data,
					skills: data.skills || [],
				});
				setImagePreview(data?.avatar || "");
				setUser(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};
		fetchUserProfile();
	}, []);

	const handleEditToggled = () => {
		setIsEditing(!isEditingbool);
	};

	const handleProfileImageChanged = (e) => {
		const file = e.target.files[0];
		setImagePreview(URL.createObjectURL(file));
		setProfileData((prevData) => ({
			...prevData,
			avatar: file,
		}));
	};

	const handleInputChanged = (e) => {
		const { name, value } = e.target;
		setProfileData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleAddSkills = () => {
		if (newSkillVar && !profileData1.skills.includes(newSkillVar)) {
			setProfileData((prevData) => ({
				...prevData,
				skills: [...prevData.skills, newSkillVar],
			}));
			setNewSkill("");
		}
	};

	const handleRemoveSkill = (skill) => {
		setProfileData((prevData) => ({
			...prevData,
			skills: prevData.skills.filter((s) => s !== skill),
		}));
	};

	const handleLocationUpdate = () => {
		console.log("log");
	};

	const handleSaveChanges = async () => {
		try {
			// Construct profile data JSON

			// If there's a new profile image, upload it first and get the URL
			if (profileData1.avatar instanceof File) {
				const imageUrl = await ApiServices.uploadPhotoToCloudinary(
					profileData1.avatar
				);
				profileData1.avatar = imageUrl;
			}
			//   console.log({ profileData });
			const updatedProfile = await ApiServices.updateUserData({
				...users,
				...profileData1,
			});
			setProfileData(updatedProfile);
			console.log(profileData1)
			setIsEditing(false);
		} catch (error) {
			console.error("Error saving changes:", error);
		}
	};
	const eventCard = (event) => {
		return (
			<div className="bg-gray-800 p-4 rounded-lg shadow-md">
				<h2 className="text-xl font-bold">{event.programme_name}</h2>
				{/* <p className="text-lg">{event.description}</p> */}
				<p className="text-md">
					{event.start_date.split("T")[0]}-
					{event.end_date.split("T")[0]}
				</p>
			</div>
		);
	};
	return (
		<div className="bg-black w-full">
			<Navbar />
			{!loadingVar && (
				<div className="text-white min-h-screen w-full flex items-start justify-start px-10">
					<div className="container p-6 w-full">
						<h2 className="text-4xl font-bold mb-6 text-left text-dark-green">
							Profile
						</h2>
						<section className="flex lg:flex-row flex-col gap-4 w-full">
							<section className="bg-gray-800 h-full lg:w-2/3 w-full rounded-xl pr-1 pb-1 text-white ">
								<div className="bg-gray-700 p-8 rounded-xl shadow-xl">
									<div className="flex flex-col md:flex-row items-center">
										{/* Profile Image Section */}
										<div className="flex flex-col items-center mb-6 md:mb-0">
											<div className="relative">
												<div className="w-40 h-40 rounded-full bg-gray-500 overflow-hidden">
													{imagePreviewVar ? (
														<img
															src={imagePreviewVar}
															alt="Profile"
															className="w-full h-full object-cover"
														/>
													) : (
														<img
															src={
																profileData1.avatar ||
																"/default-profile.png"
															}
															alt="Profile"
															className="w-full h-full object-cover"
														/>
													)}
												</div>
												{isEditingbool && (
													<label
														htmlFor="image-upload"
														className="absolute bottom-0 right-0 bg-dark-green text-white p-2 rounded-full cursor-pointer"
													>
														<FiUpload />
													</label>
												)}
											</div>
											{isEditingbool && (
												<input
													id="image-upload"
													type="file"
													accept="image/*"
													onChange={
														handleProfileImageChanged
													}
													className="hidden"
												/>
											)}
										</div>

										{/* User Info Section */}
										<div className="md:ml-8 w-full">
											{Object.entries(profileData1).map(
												([key, value]) => {
													console.log({value})
													if (
														[
															"id",
															"role",
															"avatar",
															"skills",
															"address",
															"location",
														].includes(key)
													)
														return null;

													const label =
														key === "dob"
															? "Date Of Birth"
															: key
																	.replace(
																		/_/g,
																		" "
																	)
																	.replace(
																		/\b\w/g,
																		(c) =>
																			c.toUpperCase()
																	);

													return (
														<div
															key={key}
															className="mb-6"
														>
															<label className="block text-gray-400 mb-2">
																{label}
															</label>
															{isEditingbool ? (
																<input
																	type={
																		key.includes(
																			"date"
																		)
																			? "date"
																			: key ===
																			  "email"
																			? "email"
																			: "text"
																	}
																	name={key}
																	value={
																		key.includes(
																			"date"
																		) &&
																		value
																			? value.split(
																					"T"
																			  )[0]
																			: value ||
																			  ""
																	}
																	onChange={
																		handleInputChanged
																	}
																	className="w-full p-3 border border-gray-300 rounded-md bg-gray-600 text-white"
																/>
															) : (
																<p className="text-xl break-all">
																	{new Date(
																		value
																	) instanceof
																		Date &&
																	value
																		? value?.split(
																				"T"
																		  )[0] ||
																		  ""
																		: value}
																</p>
															)}
														</div>
													);
												}
											)}
										</div>
									</div>
								</div>
							</section>

							{/* Skills Section ( @yujal in case of organization idk what to add so improvise)*/}
							{!users?.established_date ? (
								<section className="bg-gray-800 lg:w-1/3 w-full rounded-xl pr-1 pb-1 text-white">
									<div className="bg-gray-700 p-8 rounded-xl h-full shadow-xl">
										<div className="mt-6">
											<h3 className="text-xl font-semibold text-white">
												Skills
											</h3>
											<ul className="flex gap-3 flex-wrap mt-3">
												{profileData1?.skills?.map(
													(skill) => (
														<li
															key={skill}
															className="bg-green-600 px-3 py-1 rounded-full text-white flex items-center"
														>
															{isEditingbool ? (
																<>
																	{skill}
																	<button
																		onClick={() =>
																			handleRemoveSkill(
																				skill
																			)
																		}
																		className="ml-2 text-red-500"
																	>
																		<FiXCircle />
																	</button>
																</>
															) : (
																<p>{skill}</p>
															)}
														</li>
													)
												)}
											</ul>

											{/* Dropdown for Adding Skills */}
											{isEditingbool && (
												<div className="mt-4">
													<select
														value={newSkillVar}
														onChange={(e) =>
															setNewSkill(
																e.target.value
															)
														}
														className="w-full p-3 border border-gray-300 rounded-md bg-gray-600 text-white"
													>
														<option value="">
															Select a skill
														</option>
														{availableSkillsVar
															.filter(
																(skill) =>
																	!profileData1.skills.includes(
																		skill
																	)
															) // Prevent duplicates
															.map((skill) => (
																<option
																	key={
																		skill.skill_name
																	}
																	value={
																		skill.skill_name
																	}
																>
																	{
																		skill.skill_name
																	}
																</option>
															))}
													</select>
													<button
														onClick={() => {
															if (newSkillVar) {
																handleAddSkills(
																	newSkillVar
																);
																setNewSkill(""); // Reset after adding
															}
														}}
														className="mt-2 bg-green-500 text-white py-2 px-4 rounded-md"
														disabled={!newSkillVar}
													>
														Add Skill
													</button>
												</div>
											)}
										</div>
									</div>
								</section>
							) : (
								<section className="bg-gray-800 lg:w-1/3 w-full rounded-xl pr-1 pb-1 text-white">
									<div className="bg-gray-700 p-8 rounded-xl h-full shadow-xl">
										<div className="mt-6">
											<h3 className="text-xl font-semibold text-white">
												Organized Events
											</h3>
											{event && (
												<div className="mt-4 flex flex-col gap-3">
													{event
														.slice(0, 4)
														.map(eventCard)}
												</div>
											)}
										</div>
										<div className="mt-6">
											<h3 className="text-xl font-semibold text-white">
												Donations
											</h3>
											{donationss &&
											donationss.length > 0 ? (
												<div className="mt-4 flex flex-col gap-3">
													{donationss
														.slice(0, 4)
														.map(
															(
																donation,
																index
															) => (
																<div
																	key={index}
																	className="bg-gray-800 p-4 rounded-lg"
																>
																	<h4 className="text-lg font-semibold">
																		{
																			donation.donor_name
																		}
																	</h4>
																	<p className="text-sm">
																		{donation.amount
																			? `$${donation.amount}`
																			: "Amount not available"}
																	</p>
																	<p className="text-sm">
																		{
																			donation.date
																		}
																	</p>
																</div>
															)
														)}
												</div>
											) : (
												<p className="mt-2 text-gray-400">
													No donations available
												</p>
											)}
										</div>
									</div>
								</section>
							)}
						</section>
						<LocationEditorSection
							user={profileData1}
							isEditing={isEditingbool}
							onLocationUpdate={({ location, address }) =>
								setProfileData((prev) => ({
									...prev,
									location,
									address,
								}))
							}
						></LocationEditorSection>

						{/* Edit and Save Buttons */}
						<div className="flex items-center justify-between mt-6">
							{isEditingbool ? (
								<div className="flex justify-start gap-2">
									<button
										onClick={handleSaveChanges}
										className="bg-dark-green text-white py-2 px-6 rounded-md flex items-center hover:bg-[#137863]"
									>
										<FiSave className="mr-2" /> Save Changes
									</button>
									<button
										onClick={() => setIsEditing(false)}
										className="bg-red-500 text-white py-2 px-6 rounded-md flex items-center hover:bg-red-600"
									>
										<FiTrash className="mr-2"></FiTrash>{" "}
										Discard Changes
									</button>
								</div>
							) : (
								<button
									onClick={handleEditToggled}
									className="bg-blue-500 text-white py-2 px-6 rounded-md flex items-center hover:bg-blue-600"
								>
									<FiEdit className="mr-2" /> Edit Profile
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
