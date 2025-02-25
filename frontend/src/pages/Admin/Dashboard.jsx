import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const Dashboard = () => {
	const [stats, setStats] = useState({
		volunteers: 0,
		organizations: 0,
		events: 0,
	});

	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const data= await ApiServices.adminGetStats();
				
				setStats(data);
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};

		fetchCounts();
	}, []);

	return (
		<div className="p-6 space-y-6 w-full">
			<div className="flex w-full justify-center gap-4">
				<Link
					to="/dashboard"
					className="bg-gray-500 justify-self-start flex gap-1 items-center text-white px-6 py-2 rounded-lg shadow hover:bg-gray-600"
				>
					<IoIosArrowBack></IoIosArrowBack> Back to Normal Mode{" "}
				</Link>
				<Link
					to="/admin/volunteers"
					className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
				>
					Manage Volunteers
				</Link>
				<Link
					to={"/admin/organizations"}
					className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
				>
					Manage Organizations
				</Link>
				<Link
					to={"/admin/events"}
					className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700"
				>
					Manage Events
				</Link>
			</div>
			{/* Stats Section */}
			<div className="grid grid-cols-3 mx-10 gap-6 text-center">
				<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold">{stats.volunteers}</h2>
					<p className="text-lg">Volunteers</p>
				</div>
				<div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold">
						{stats.organizations}
					</h2>
					<p className="text-lg">Organizations</p>
				</div>
				<div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold">{stats.events}</h2>
					<p className="text-lg">Events</p>
				</div>
			</div>

			{/* Buttons Section */}
		</div>
	);
};

export default Dashboard;
