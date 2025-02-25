import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import ApiServices from "../../frontend-lib/api/ApiServices";
import { showToast } from "../../utils/toasts";

const ManageOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const data = await ApiServices.adminGetAllOrganizations();
                setOrganizations(data);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };

        fetchOrganizations();
    }, []);

    const handleRoleToggle = async (email, promote) => {
        try {
            const message = await ApiServices.updateUserRole(email, promote);
            showToast(message);
			try{

				const data = await ApiServices.adminGetAllOrganizations();
				if(!data){
					navigate("/dashboard")
					window.location.reload()
				}
				setOrganizations(data);

			}catch(e){	
				navigate("/dashboard")
				window.location.reload()
			}
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

            {/* Organizations Table */}
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
                        {organizations.length > 0 ? (
                            organizations.map((organization) => (
                                <tr key={organization.email} className="border-b">
                                    <td className="p-4">{organization.organization_name}</td>
                                    <td className="p-4">{organization.email}</td>
                                    <td className="p-4">
                                        {organization.role === "admin" ? "Admin" : "Organization"}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleRoleToggle(organization.email, organization.role !== "admin")}
                                            className={`${organization.role === "admin" ? "bg-red-500" : "bg-green-500"} text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600`}
                                        >
                                            {organization.role === "admin" ? "Demote" : "Promote"} to Admin
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center">
                                    No organizations found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrganizations;
