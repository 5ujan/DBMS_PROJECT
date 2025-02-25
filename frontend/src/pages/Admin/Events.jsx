import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const ManageEvents = () => {


	useEffect(() => {
		const fetchCounts = async () => {
			try {
			} catch (error) {
				console.error("Error fetching stats:", error)
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
			

			{/* Buttons Section */}
		</div>
	);
};

export default ManageEvents;
