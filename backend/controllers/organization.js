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

const makeDonation = async (req, res) => { 
    try {
        const uuid = require("uuid");
        const id = uuid.v4();   
        console.log("makeDonation");
        const { donor_id, organization_id, amount } = req.body;
        const dontation_date = new Date().toISOString().split('T')[0];
        console.log({dontation_date})
        const query = `INSERT INTO DONATIONS (donor_id, donation_id, organization_id, amount, donation_date) VALUES (?, ?, ?, ?, ?)`;
        await db.query(query, [donor_id, id, organization_id, amount, dontation_date]);
        return res.status(201).json({ message: "Donation made successfully" });
    } catch (error) {
        console.error("Error making donation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getOrganizationById, makeDonation};