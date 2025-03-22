import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import ApiServices from "../frontend-lib/api/ApiServices";
import { FiEdit, FiSave, FiTrash, FiUpload, FiXCircle } from "react-icons/fi";
import Navbar from "../components/Nav";
import { showToast } from "../utils/toasts";

const Organization = () => {
	const [organizationData, setOrganizationData] = useState({
		name: "",
		email: "",
		role: "",
		avatar: "",
		created_at: "",
	});
	const [imgPreview, setImagePreview] = useState(null);
	const [load, setLoading] = useState(true);
	const { user: userID, setUser } = useStore();
	const navigateVar = useNavigate();
	const [organizationIdx, setOrganizationId] = useState(null);
	const [event, setEvents] = useState([]);
	const [donateOpen, setDonateOpen] = useState(false);
	const [donationAmount, setDonateAmount] = useState(0);
    const [donations, setDonations] = useState([]);
	useEffect(() => {
		const pathParts = window.location.pathname.split("/");
		const id = pathParts[pathParts.length - 1];
		console.log(id);
		setOrganizationId(id);
	}, []);
	useEffect(() => {
		const fetchOrganizationProfile = async () => {
			try {
				if (organizationIdx) {
					const data = await ApiServices.getOrganizationById(
						organizationIdx
					);
					const events = await ApiServices.getEventsByOrganization(
						organizationIdx
					);
                    const d = await ApiServices.getDonationsByOrganization(
                        organizationIdx )
                        setDonations(d)
					setOrganizationData(data[0]);

					setImagePreview(data?.avatar || "");
					setEvents(events);
					setLoading(false);
				}
			} catch (error) {
				console.error("Error fetching Data:", error);
			}
		};
		fetchOrganizationProfile();
	}, [organizationIdx]);
	// console.log(organizationData)
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
			{!load && (
				<div className="text-white min-h-screen w-full flex items-start justify-start px-10">
					<div className="container p-6 w-full">
						<div className="w-full flex flex-row justify-between">
							<h2 className="text-4xl font-bold mb-6 text-left text-green-500">
								Profile
							</h2>
							<button
								className="text-xl mb-6 text-left text-white bg-green-700 px-5 rounded-lg"
								onClick={() => setDonateOpen(true)}
							>
								Donate
							</button>
						</div>
						<section className="flex lg:flex-row flex-col gap-4 w-full">
							<section className="bg-gray-800 w-full lg:w-2/3 rounded-xl pr-1 pb-1 text-white ">
								<div className="bg-gray-700 p-8 rounded-xl shadow-xl">
									<div className="flex flex-col md:flex-row items-center">
										{/* Profile Image Section */}
										<div className="flex flex-col items-center mb-6 md:mb-0">
											<div className="relative">
												<div className="w-40 h-40 rounded-full bg-gray-500 overflow-hidden">
													{imgPreview ? (
														<img
															src={imgPreview}
															alt="Profile"
															className="w-full h-full object-cover"
														/>
													) : (
														<img
															src={
																organizationData.avatar ||
																"/default-profile.png"
															}
															alt="Profile"
															className="w-full h-full object-cover"
														/>
													)}
												</div>
											</div>
										</div>

										{/* User Info Section */}
										<div className="md:ml-8 w-full">
											{Object.entries(
												organizationData
											).map(([key, value]) => {
												if (
													[
														"id",
														"role",
														"avatar",
														"skills",
														"organization_id",
														"password",
													].includes(key)
												)
													return null;

												const label = key;
												return (
													<div
														key={key}
														className="mb-6"
													>
														<label className="block text-gray-400 mb-2">
															{label}
														</label>
														{value}
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</section>

							{/* Skills Section ( @yujal in case of organization idk what to add so improvise)*/}
							<section className="bg-gray-800  w-full lg:w-1/3 rounded-xl pr-1 pb-1 text-white">
								<div className="bg-gray-700 p-8 rounded-xl h-full shadow-xl">
									<div className="mt-6">
										<h3 className="text-xl font-semibold text-green-500">
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
										{donations && donations.length > 0 ? (
											<div className="mt-4 flex flex-col gap-3">
												{donations
													.slice(0, 4)
													.map((donation, index) => (
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
																{donation.date}
															</p>
														</div>
													))}
											</div>
										) : (
											<p className="mt-2 text-gray-400">
												No donations available
											</p>
										)}
									</div>
								</div>
							</section>
						</section>
					</div>
				</div>
			)}
			{donateOpen && (
				<DonateModal
                    organizationId = {organizationIdx}
					open={donateOpen}
					onClose={() => setDonateOpen(false)}
					donateAmount={donationAmount}
					setDonateAmount={setDonateAmount}
				/>
			)}
		</div>
	);
};

const DonateModal = ({ open,organizationId, onClose, donateAmount, setDonateAmount }) => {
    const {user} = useStore()
	const handleDonateChange = (e) => {
		setDonateAmount(e.target.value);
	};
	const handleDonate = async () => {
        await ApiServices.makeDonation({
            donor_id: user.id,
            organization_id: organizationId,
            amount: donateAmount,
        });
		showToast("Donation Successful", "success");
		setDonateAmount(0);
		onClose();
	};
	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
				open ? "block" : "hidden"
			}`}
		>
			<div className="bg-gray-800 p-8 rounded-lg">
				<div className="flex justify-end">
					<button
						className="top-2 right-2 text-white"
						onClick={onClose}
					>
						<FiXCircle className="text-2xl" />
					</button>
				</div>
				<h2 className="text-2xl font-bold text-green-500">
					Donate to Organization
				</h2>
				<div className="flex flex-col gap-4 mt-4">
					<label className="text-white">Amount</label>
					<input
						value={donateAmount}
						onChange={handleDonateChange}
						type="number"
						className="rounded-lg p-2 bg-gray-700 text-white"
					/>
					<button
						onClick={handleDonate}
						className="bg-green-500 text-white rounded-lg p-2"
					>
						Donate
					</button>
				</div>
			</div>
		</div>
	);
};
export default Organization;
