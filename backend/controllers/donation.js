const db = require("../connectDB");

// Get all donations with organization and donor details
exports.getAllDonations = async (req, res) => {
    try {
        const [donations] = await db.query(`
            SELECT D.*, 
                   O.organization_name, 
                   COALESCE(V.name, ORG.organization_name) AS donor_name
            FROM DONATIONS D
            JOIN ORGANIZATION O ON D.organization_id = O.organization_id
            LEFT JOIN VOLUNTEER V ON D.donor_id = V.volunteer_id
            LEFT JOIN ORGANIZATION ORG ON D.donor_id = ORG.organization_id
        `);
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations", error });
    }
};

// Get donation by ID with organization and donor details
exports.getDonationById = async (req, res) => {
    const { id } = req.params;
    try {
        const [donation] = await db.query(`
            SELECT D.*, 
                   O.organization_name, 
                   COALESCE(V.name, ORG.organization_name) AS donor_name
            FROM DONATIONS D
            JOIN ORGANIZATION O ON D.organization_id = O.organization_id
            LEFT JOIN VOLUNTEER V ON D.donor_id = V.volunteer_id
            LEFT JOIN ORGANIZATION ORG ON D.donor_id = ORG.organization_id
            WHERE D.donation_id = ?
        `, [id]);

        if (!donation.length) {
            return res.status(404).json({ message: "Donation not found" });
        }

        res.status(200).json(donation[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donation", error });
    }
};

// Get all donors (either from organizations or volunteers)
exports.getDonors = async (req, res) => {
    try {
        const [donors] = await db.query(`
            SELECT DISTINCT COALESCE(V.name, O.organization_name) AS donor_name
            FROM DONATIONS D
            LEFT JOIN VOLUNTEER V ON D.donor_id = V.volunteer_id
            LEFT JOIN ORGANIZATION O ON D.donor_id = O.organization_id
        `);
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donors", error });
    }
};

// Get donations by organization
exports.getDonationsByOrganization = async (req, res) => {
    const { id } = req.params;
    try {
        const [donations] = await db.query(`
            SELECT D.*, 
                   O.organization_name, 
                   COALESCE(V.name, ORG.organization_name) AS donor_name
            FROM DONATIONS D
            JOIN ORGANIZATION O ON D.organization_id = O.organization_id
            LEFT JOIN VOLUNTEER V ON D.donor_id = V.volunteer_id
            LEFT JOIN ORGANIZATION ORG ON D.donor_id = ORG.organization_id
            WHERE D.organization_id = ?
        `, [id]);

        if (!donations.length) {
            return res.status(200).json([]);
        }

        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations for the organization", error });
    }
};
