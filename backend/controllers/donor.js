const db = require("../connectDB");

const getAllDonors = (req, res) => {
    const query = "SELECT * FROM DONORS";
    db.query(query, (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        res.status(200).json(results);
    });
};

const getDonorById = (req, res) => {
    const query = "SELECT * FROM DONORS WHERE donor_id = ?";
    db.query(query, [req.params.id], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        if (results.length === 0) return res.status(404).json({ message: "Donor not found" });
        res.status(200).json(results[0]);
    });
};

const createDonor = (req, res) => {
    const { donor_id, donor_type, email, name } = req.body;
    const query = "INSERT INTO DONORS (donor_id, donor_type, email, name) VALUES (?, ?, ?, ?)";
    db.query(query, [donor_id, donor_type, email, name], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        res.status(201).json({ message: "Donor created successfully" });
    });
};

const deleteDonor = (req, res) => {
    const query = "DELETE FROM DONORS WHERE donor_id = ?";
    db.query(query, [req.params.id], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Donor not found" });
        res.status(200).json({ message: "Donor deleted successfully" });
    });
};

module.exports = { getAllDonors, getDonorById, createDonor, deleteDonor };
