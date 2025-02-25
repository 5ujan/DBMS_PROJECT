import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";
import { useNavigate } from "react-router-dom";

const ManageVolunteers = () => {
	const [volunteers, setVolunteers] = useState([]);
  const navigate = useNavigate();
	useEffect(() => {
		const fetchVolunteers = async () => {
			try {
				const data = await ApiServices.adminGetAllVolunteers();
				setVolunteers(data);
			} catch (error) {
				console.error("Error fetching volunteers:", error);
			}
		};

		fetchVolunteers();
	}, []);

	const handleRoleToggle = async (email, promote) => {
		try {
      console.log(email, promote)
			const message = await ApiServices.updateUserRole(email, promote);
			showToast(message);
      try{
        const data = await ApiServices.adminGetAllVolunteers();
        console.log({data})
        if(!data){
          navigate("/dashboard")
          window.location.reload(); 
        }
        setVolunteers(data);
      }catch(e){ 
        console.log(e)  
          navigate("/dashboard")
      }
			setVolunteers(data);
		} catch (error) {
			console.error("Error toggling role:", error);
		}
	};

	return (
		<div className="p-6 space-y-6 w-full">
			<div className="flex w-full justify-center gap-4">
				<Link
					to="/dashboard"
					className="bg-gray-500 justify-self-start flex gap-1 items-center text-white px-6 py-2 rounded-lg shadow hover:bg-gray-600"
				>
					<IoIosArrowBack /> Back to Normal Mode
				</Link>
				<Link
					to="/admin/volunteers"
					className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
				>
					Manage Volunteers
				</Link>
				<Link
					to="/admin/organizations"
					className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
				>
					Manage Organizations
				</Link>
				<Link
					to="/admin/events"
					className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700"
				>
					Manage Events
				</Link>
			</div>

			{/* Volunteers Table */}
			<div className="overflow-x-auto mt-6">
				<table className="min-w-full bg-black border border-gray-300 rounded-lg shadow-md">
					<thead>
						<tr>
							<th className="p-4 text-left">Name</th>
							<th className="p-4 text-left">Email</th>
							<th className="p-4 text-left">Role</th>
							<th className="p-4 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{volunteers.length > 0 ? (
							volunteers.map((volunteer) => (
								<tr key={volunteer.email} className="border-b">
									<td className="p-4">{volunteer.name}</td>
									<td className="p-4">{volunteer.email}</td>
									<td className="p-4">
										{volunteer.role === "admin"
											? "Admin"
											: "Volunteer"}
									</td>
									<td className="p-4">
										<button
											onClick={() =>
												handleRoleToggle(
													volunteer.email,
													volunteer.role !== "admin"
												)
											}
											className={`${
												volunteer.role === "admin"
													? "bg-red-500"
													: "bg-green-500"
											} text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600`}
										>
											{volunteer.role === "admin"
												? "Demote from"
												: "Promote to"}{" "}
											 Admin
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="4" className="p-4 text-center">
									No volunteers found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageVolunteers;
