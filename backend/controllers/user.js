const db = require("../connectDB");

const updateProfile = async (req, res) => {
	console.log(req.user);
	try {
		if (!req.user || !req.user.role) {
			return res.status(400).json({ message: "User role is not found" });
		}

		if (req.user.role === "volunteer") {
			const {
				name,
				email,
				phone,
				gender,
				dob,
				skills,
				avatar,
				created_at,
				address,
				location,
			} = req.body;
			const {lat:latitude, lng:longitude} =location
			// Update volunteer profile
			const updateVolunteerQuery = `
          UPDATE VOLUNTEER
          SET name = ?, email = ?, phone = ?, gender = ?, dob = ?, avatar = ?, created_at = ?, latitude= ?, longitude=? , address=?
          WHERE volunteer_id = ?`;
			await db.query(updateVolunteerQuery, [
				name,
				email,
				phone,
				gender,
				dob,
				avatar,
				created_at,
				latitude, longitude, address,
				req.user.id,
			]);

			// Update skills if provided
			if (skills && skills.length) {
				await db.query(
					"DELETE FROM VOLUNTEER_SKILL WHERE volunteer_id = ?",
					[req.user.id]
				);
				const insertSkillsQuery =
					"INSERT INTO VOLUNTEER_SKILL (volunteer_id, skill_name) VALUES ?";
				const skillsValues = skills.map((skill) => [
					req.user.id,
					skill,
				]);
				await db.query(insertSkillsQuery, [skillsValues]);
			}

			return res
				.status(200)
				.json({ message: "Profile updated successfully" });
		}

		if (req.user.role === "organization") {
			const {
				organization_name,
				email,
				contact_phone,
				avatar,
				established_date,
				contact_email,
				address,
				location
			} = req.body;
			const {lat:latitude, lng:longitude} = location
			// Update organization profile
			const updateOrganizationQuery = `
          UPDATE ORGANIZATION
          SET organization_name = ?, email = ?, contact_phone = ?, avatar = ?, established_date = ?, contact_email = ?, latitude= ?, longitude=? , address=?
          WHERE organization_id = ?`;
			await db.query(updateOrganizationQuery, [
				organization_name,
				email,
				contact_phone,
				avatar,
				established_date,
				contact_email,
				latitude,
				longitude, address,
				req.user.id,
			]);

			return res
				.status(200)
				.json({ message: "Organization profile updated successfully" });
		}

		if (req.user.role === "admin") {
			return res
				.status(403)
				.json({ message: "Admin profiles cannot be updated here" });
		}

		return res.status(403).json({ message: "Forbidden access" });
	} catch (err) {
		console.error("Error in /updateProfile route: ", err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const getData = async (req, res) => {
	console.log(req.user);
	try {
		if (!req.user || !req.user.role) {
			return res.status(400).json({ message: "User role is not found" });
		}

		// Handle volunteer data
		if (req.user.role === "volunteer") {
			const volunteerQuery = `
                SELECT volunteer_id AS id, name, email, dob, phone, gender, created_at, avatar, latitude, longitude, address
                FROM VOLUNTEER 
                WHERE volunteer_id = ?`;

			const skillsQuery = `
                SELECT S.skill_name 
                FROM SKILL S
                JOIN VOLUNTEER_SKILL VS ON S.skill_name = VS.skill_name
                WHERE VS.volunteer_id = ?`;

			const [volunteerRows] = await db.query(volunteerQuery, [
				req.user.id,
			]);
			if (volunteerRows.length === 0) {
				return res.status(404).json({ message: "Volunteer not found" });
			}

			const [skillsRows] = await db.query(skillsQuery, [req.user.id]);
			const skills = skillsRows.map((row) => row.skill_name);

			const volunteer = volunteerRows[0];
			return res.json({ ...volunteer, role: "volunteer", skills });
		}

		// Handle organization data
		if (req.user.role === "organization") {
			const query = `
                SELECT organization_id AS id, organization_name AS name, email,contact_email, established_date, avatar, contact_phone AS phone, created_at, latitude, longitude, address
                FROM ORGANIZATION 
                WHERE organization_id = ?`;

			const [rows] = await db.query(query, [req.user.id]);
			if (rows.length === 0) {
				return res
					.status(404)
					.json({ message: "Organization not found" });
			}

			return res.json({ ...rows[0], role: "organization" });
		}

		// Handle admin data
		if (req.user.role === "admin") {
			const volunteerQuery = `
                SELECT volunteer_id AS id, name, email, dob, phone, gender, avatar, created_at
                FROM VOLUNTEER 
                WHERE volunteer_id = ?`;

			const organizationQuery = `
                SELECT organization_id AS id, organization_name AS name, email, avatar, established_date, contact_phone AS phone, created_at
                FROM ORGANIZATION 
                WHERE organization_id = ?`;

			const skillsQuery = `
                SELECT S.skill_name 
                FROM SKILL S
                JOIN VOLUNTEER_SKILL VS ON S.skill_name = VS.skill_name
                WHERE VS.volunteer_id = ?`;

			const [volunteerResults] = await db.query(volunteerQuery, [
				req.user.id,
			]);
			const [organizationResults] = await db.query(organizationQuery, [
				req.user.id,
			]);

			if (volunteerResults.length > 0) {
				// If the user is a volunteer, also fetch their skills
				const [skillsRows] = await db.query(skillsQuery, [req.user.id]);
				const skills = skillsRows.map((row) => row.skill_name);

				return res.json({
					...volunteerResults[0],
					role: "admin",
					skills,
				});
			}
			if (organizationResults.length > 0) {
				return res.json({
					...organizationResults[0],
					role: "admin",
				});
			}

			return res.status(404).json({ message: "No matching user found" });
		}

		return res.status(403).json({ message: "Forbidden access" });
	} catch (err) {
		console.error("Error in /user route:", err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const getMyEvents = async (req, res)=>{
	if(req.user.role !== "organization"){
	try {
		const [events] = await db.query(`
			SELECT * from PROGRAMMES natural join ORGANIZATION join VOLUNTEER_PROGRAMMES on PROGRAMMES.programme_id = VOLUNTEER_PROGRAMMES.programme_id where volunteer_id = ?;
		`, [req.user.id]);
		res.json(events);
	}
	catch (error) {
		res.status(500).json({ message: "Error fetching events", error });
	}
	}
	else{
		try {
			const [events] = await db.query(`
				SELECT * from PROGRAMMES natural join ORGANIZATION where organization_id = ?;
			`, [req.user.id]);
			res.json(events);
		}
		catch (error) {
			res.status(500).json({ message: "Error fetching events", error });
		}
	}
}

module.exports = { getData, updateProfile, getMyEvents }; // Correctly export the function
