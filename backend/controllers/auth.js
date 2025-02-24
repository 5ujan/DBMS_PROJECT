require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../connectDB");


// Register route for both volunteer and organization
const register = async (req, res) => {
    const { name, email, password, dob, role, phone, gender, organizationName, establishedDate, contactEmail, contactPhone } = req.body;
    
    try {
        // Validate input (Basic example, you can add more validation here)
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Email, password, and role are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        // Handle Volunteer registration
        if (role === 'individual') {
            const volunteerQuery = `
                INSERT INTO VOLUNTEER (volunteer_id, email, password, name, dob, phone, gender) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
            const [result] = await db.query(volunteerQuery, [id, email, hashedPassword, name, dob, phone, gender]);
            
            const token = jwt.sign(
                { id, role:"volunteer" },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            res.status(201).json({
                message: "Volunteer registered successfully!",
                token,
            });
        }
        // Handle Organization registration
        else if (role === 'organization') {
            const orgQuery = `
                INSERT INTO ORGANIZATION (organization_id, email, password, organization_name, established_date, contact_email, contact_phone) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
            const [result] = await db.query(orgQuery, [id, email, hashedPassword, organizationName, establishedDate, contactEmail, contactPhone]);
            
            const token = jwt.sign(
                { id, role },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            res.status(201).json({
                message: "Organization registered successfully!",
                token,
            });
        } else {
            return res.status(400).json({ message: "Invalid role provided" });
        }
    } catch (err) {
        console.error("Error in register:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for volunteer
        const [volunteerResults] = await db.query("SELECT * FROM VOLUNTEER WHERE email = ?", [email]);

        if (volunteerResults.length > 0) {
            const user = volunteerResults[0];

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Generate token for volunteer
            const token = jwt.sign(
                { id: user.volunteer_id, role: 'volunteer' },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            return res.json({
                message: "Logged in successfully",
                token,
                user: {
                    id: user.volunteer_id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender
                }
            });
        }

        // If not a volunteer, check for organization
        const [organizationResults] = await db.query("SELECT * FROM ORGANIZATION WHERE email = ?", [email]);

        if (organizationResults.length === 0) {
            return res.status(404).json({ message: "Email not found" });
        }

        const org = organizationResults[0];

        // Compare the password for organization
        const isMatch = await bcrypt.compare(password, org.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token for organization
        const token = jwt.sign(
            { id: org.organization_id, role: 'organization' },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.json({
            message: "Logged in successfully",
            token,
            user: {
                id: org.organization_id,
                organization_name: org.organization_name,
                email: org.email,
                contact_email: org.contact_email,
                contact_phone: org.contact_phone
            }
        });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { login };
module.exports = {register,login}


