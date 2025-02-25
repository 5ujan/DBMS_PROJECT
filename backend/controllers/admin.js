const db = require("../connectDB");

const getStats = async (req, res) => {
	try {
		const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM VOLUNTEER) AS volunteers,
          (SELECT COUNT(*) FROM ORGANIZATION) AS organizations,
          (SELECT COUNT(*) FROM PROGRAMMES) AS events
      `;

		const [rows] = await db.query(statsQuery);
		res.status(200).json(rows[0]);
	} catch (error) {
		console.error("Error fetching stats: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const deleteOrganization = async (req, res) => {
	const { id } = req.params;

	try {
		const deleteQuery =
			"DELETE FROM ORGANIZATION WHERE organization_id = ?";
		const [result] = await db.query(deleteQuery, [id]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Organization not found" });
		}

		res.status(200).json({ message: "Organization deleted successfully" });
	} catch (error) {
		console.error("Error deleting organization: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const deleteVolunteer = async (req, res) => {
	const { id } = req.params;

	try {
		const deleteQuery = "DELETE FROM VOLUNTEER WHERE volunteer_id = ?";
		const [result] = await db.query(deleteQuery, [id]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Volunteer not found" });
		}

		res.status(200).json({ message: "Volunteer deleted successfully" });
	} catch (error) {
		console.error("Error deleting volunteer: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const deleteEvent = async (req, res) => {
	const { id } = req.params;

	try {
		const deleteQuery = "DELETE FROM EVENT WHERE event_id = ?";
		const [result] = await db.query(deleteQuery, [id]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Event not found" });
		}

		res.status(200).json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const updateUserRole = async (req, res) => {
	const { id } = req.params;
	const { email, promote } = req.body; // Role can be 'promote' or 'demote'

	try {
		if (promote) {
			// Promote user to admin
			const checkIfAdmin = "SELECT * FROM ADMIN WHERE email = ?";
			const [adminCheck] = await db.query(checkIfAdmin, [email]);

			if (adminCheck.length > 0) {
				return res
					.status(400)
					.json({ message: "User is already an admin" });
			}

			const insertAdminQuery = "INSERT INTO ADMIN (email) VALUES (?)";
			await db.query(insertAdminQuery, [email]);

			// You can optionally also update user table to reflect this change

			return res.status(200).json({ message: "User promoted to admin" });
		}

		if (!promote) {
			// Demote user from admin
			const checkIfAdmin = "SELECT * FROM ADMIN WHERE email = ?";
			const [adminCheck] = await db.query(checkIfAdmin, [email]);

			if (adminCheck.length === 0) {
				return res
					.status(404)
					.json({ message: "User is not an admin" });
			}

			const deleteAdminQuery = "DELETE FROM ADMIN WHERE email = ?";
			await db.query(deleteAdminQuery, [email]);

			return res.status(200).json({ message: "User demoted from admin" });
		}

		return res.status(400).json({ message: "Invalid role specified" });
	} catch (error) {
		console.error("Error updating user role: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
const getAllVolunteers = async (req, res) => {
	try {
		const [volunteers] = await db.query(`SELECT 
    VOLUNTEER.*,
    CASE 
        WHEN ADMIN.email IS NOT NULL THEN 'admin' 
        ELSE 'volunteer' 
    END AS role
FROM 
    VOLUNTEER 
LEFT JOIN 
    ADMIN 
ON 
    VOLUNTEER.email = ADMIN.email;
`);
		console.log(volunteers);
		res.status(200).json(volunteers);
	} catch (error) {
		console.error("Error fetching volunteers: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getAllOrganizations = async (req, res) => {
	try {
		const [organizations] = await db.query(
			`SELECT 
    ORGANIZATION.*,
    CASE 
        WHEN ADMIN.email IS NOT NULL THEN 'admin' 
        ELSE 'organization' 
    END AS role
FROM 
    ORGANIZATION 
LEFT JOIN 
    ADMIN 
ON 
    ORGANIZATION.email = ADMIN.email;
`
		);
		res.status(200).json(organizations);
	} catch (error) {
		console.error("Error fetching organizations: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = {
	getStats,
	getAllOrganizations,
	getAllVolunteers,
	deleteOrganization,
	deleteVolunteer,
	deleteEvent,
	updateUserRole,
};
