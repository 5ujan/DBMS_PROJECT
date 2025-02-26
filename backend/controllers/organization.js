const db = require("../connectDB");

const getOrganizationById = async (req, res) => {
    try {
        console.log("getOrganizationById");
        const { id } = req.params;
        const query = `SELECT * FROM ORGANIZATION WHERE organization_id = ?`;
        const [organization] = await db.query(query, [id]);
        if (!organization) {
        return res.json([]);
        }
        return res.status(200).json(organization);
    } catch (error) {
        console.error("Error fetching organization:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    }

module.exports = { getOrganizationById };