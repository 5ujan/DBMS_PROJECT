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
		created_at: ""
	});
	const [imagePreview, setImagePreview] = useState(null);
	const [loading, setLoading] = useState(true);
	const {user, setUser} = useStore()
    const navigate = useNavigate();
    const [organizationId, setOrganizationId] = useState(null);
    const [events, setEvents] = useState([]);
    const [donateOpen, setDonateOpen] = useState(false);
    const [donateAmount, setDonateAmount] = useState(0);
    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        console.log(id)
        setOrganizationId(id);
    }, []);
	useEffect(() => {
		const fetchOrganizationProfile = async () => {
			try {
                if (organizationId){
                const data = await ApiServices.getOrganizationById(organizationId);
                const events = await ApiServices.getEventsByOrganization(organizationId);
                setOrganizationData(data[0]);
                setImagePreview(data?.avatar||'');
                setEvents(events);
                setLoading(false);  
            }
            } catch (error) {
                console.error("Error fetching Data:", error);
            }
		};
		fetchOrganizationProfile();
	}, [organizationId]);
    // console.log(organizationData)
    const eventCard = (event) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{event.programme_name}</h2>
            {/* <p className="text-lg">{event.description}</p> */}
            <p className="text-md">{event.start_date.split("T")[0]}-{event.end_date.split("T")[0]}</p>
    
        </div>
        );
    }
	return (
		<div className="bg-black w-full">
			<Navbar />
			{!loading && (
				<div className="text-white min-h-screen w-full flex items-start justify-start px-10">
					<div className="container p-6 w-full">
                        <div className="w-full flex flex-row justify-between">

						<h2 className="text-4xl font-bold mb-6 text-left text-green-500">
							Profile
						</h2>
						<button className="text-xl mb-6 text-left text-white bg-green-700 px-5 rounded-lg"
                            onClick={() => setDonateOpen(true)}>
							Donate
						</button>
                        </div>
						<section className="flex gap-4 w-full">
							<section className="bg-gray-800 w-2/3 rounded-xl pr-1 pb-1 text-white ">
								<div className="bg-gray-700 p-8 rounded-xl shadow-xl">
									<div className="flex flex-col md:flex-row items-center">
										{/* Profile Image Section */}
										<div className="flex flex-col items-center mb-6 md:mb-0">
											<div className="relative">
												<div className="w-40 h-40 rounded-full bg-gray-500 overflow-hidden">
													{imagePreview ? (
														<img
															src={imagePreview}
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
                                            {Object.entries(organizationData).map(([key, value]) => {
                                                if (["id", "role", "avatar", "skills","organization_id","password"].includes(key)) return null;

                                                const label = key
                                                return (
                                                <div key={key} className="mb-6">
                                                    <label className="block text-gray-400 mb-2">{label}</label>
                                                    {value}
                                                </div>
                                                );
                                            })}
                                            </div>
									</div>
								</div>
							</section>

							{/* Skills Section ( @yujal in case of organization idk what to add so improvise)*/}
							<section className="bg-gray-800 w-1/3 rounded-xl pr-1 pb-1 text-white">
      <div className="bg-gray-700 p-8 rounded-xl h-full shadow-xl">
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-500">Organized Events</h3>
            {events && (<div className="mt-4 flex flex-col gap-3">
                {events.slice(0,4).map(eventCard)}
            </div>)}
        </div>
      </div>
    </section>
						</section>
						
					</div>
				</div>
			)}
            {donateOpen && <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} donateAmount={donateAmount} setDonateAmount={setDonateAmount} />}
		</div>
	);
};

const DonateModal = ({ open, onClose, donateAmount, setDonateAmount }) => {
    const handleDonateChange = (e) => {
        setDonateAmount(e.target.value);
    }
    const handleDonate = () => {
        showToast("Donation Successful", "success");
        setDonateAmount(0);
        onClose();
    }
    return(
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${open ? 'block' : 'hidden'}`}>
            <div className="bg-gray-800 p-8 rounded-lg">
                <div className="flex justify-end">
                <button className="top-2 right-2 text-white" onClick={onClose}>
                    <FiXCircle className="text-2xl" />
                </button>
                </div>
                <h2 className="text-2xl font-bold text-green-500">Donate to Organization</h2>
                <div className="flex flex-col gap-4 mt-4">
                    <label className="text-white">Amount</label>
                    <input value={donateAmount} onChange={handleDonateChange} type="number" className="rounded-lg p-2 bg-gray-700 text-white" />
                    <button onClick={handleDonate} className="bg-green-500 text-white rounded-lg p-2">Donate</button>
                </div>
            </div>
        </div>
    )
}
export default Organization;


