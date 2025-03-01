const db = require("../connectDB");
const { v4: uuidv4 } = require("uuid");

// Get all events with organization details
exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query(`
            SELECT 
                p.programme_id, p.programme_name, p.description, p.start_date, p.end_date,p.image,
                o.organization_id, o.organization_name, o.contact_email, o.contact_phone
            FROM PROGRAMMES p
            NATURAL JOIN ORGANIZATION o
        `);
        console.log(events)
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }

};

// Get event by ID with organization details
exports.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const [event] = await db.query(`
            SELECT 
                p.programme_id, p.programme_name, p.description, p.start_date, p.end_date,
                o.organization_id, o.organization_name, o.contact_email, o.contact_phone
            FROM PROGRAMMES p
            NATURAL JOIN ORGANIZATION o
            WHERE p.programme_id = ?
        `, [id]);

        if (!event.length) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
};

exports.getEventsByOrganization = async (req, res) => {
    const { id } = req.params;
    try {
        const [events] = await db.query(`
            SELECT * FROM PROGRAMMES WHERE organization_id = ?
        `, [id]);

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
}

// Get volunteers registered for an event
exports.getEventVolunteers = async (req, res) => {
    const { id } = req.params;
    try {
        const [volunteers] = await db.query(`
            SELECT v.volunteer_id, v.name, v.email, v.phone, v.gender, vp.registration_date, vp.status
            FROM VOLUNTEER_PROGRAMMES vp
            JOIN VOLUNTEER v ON vp.volunteer_id = v.volunteer_id
            WHERE vp.programme_id = ?
        `, [id]);

        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching volunteers", error });
    }
};

// Create event (Only organizations)
exports.createEvent = async (req, res) => {
    if (req.user.role !== "organization") {
        return res.status(403).json({ message: "Access denied" });
    }

    const { programme_name, description, start_date, end_date, image } = req.body;
    console.log(req.body)
    const programme_id = uuidv4();
    const organization_id = req.user.id;

    try {
        const [newEvent] = await db.query(`
            INSERT INTO PROGRAMMES (programme_id, organization_id, programme_name, description, start_date, end_date, image) 
            VALUES (?, ?, ?, ?, ?, ?,?)`, 
            [programme_id, organization_id, programme_name, description, start_date, end_date, image]);

        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error });
    }
};

// Register volunteer for an event
exports.registerVolunteer = async (req, res) => {
    if (req.user.role === "organization") {
        return res.status(403).json({ message: "Only volunteers and admin can register" });
    }

    const volunteer_id = req.user.id;
    const { id: programme_id } = req.params;

    try {
        const [existingRegistration] = await db.query(`
            SELECT * FROM VOLUNTEER_PROGRAMMES WHERE volunteer_id = ? AND programme_id = ?
        `, [volunteer_id, programme_id]);

        if (existingRegistration.length > 0) {
            return res.status(400).json({ message: "Already registered" });
        }

        await db.query(`
            INSERT INTO VOLUNTEER_PROGRAMMES (volunteer_id, programme_id, registration_date, status) 
            VALUES (?, ?, CURRENT_DATE, 'pending')
        `, [volunteer_id, programme_id]);

        res.json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Error registering", error });
    }
};

// Update event (Only organizations who created it)
exports.updateEvent = async (req, res) => {
    if (req.user.role !== "organization") {
        return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const { programme_name, description, start_date, end_date, image} = req.body;
    const organization_id = req.user.id;

    try {
        // Check if event exists and belongs to the organization
        const [event] = await db.query(`
            SELECT * FROM PROGRAMMES WHERE programme_id = ? AND organization_id = ?
        `, [id, organization_id]);

        if (event.length === 0) {
            return res.status(404).json({ message: "Event not found or unauthorized" });
        }

        // Update the event
        const [updatedEvent] = await db.query(`
            UPDATE PROGRAMMES
            SET programme_name = ?, description = ?, start_date = ?, end_date = ?, image = ?
            WHERE programme_id = ?`, 
            [programme_name, description, start_date, end_date, image, id]);

        res.json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error });
    }
};

// Delete event (Only organizations who created it)
exports.deleteEvent = async (req, res) => {
    if (req.user.role !== "organization") {
        return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const organization_id = req.user.id;

    try {
        // Check if event exists and belongs to the organization
        const [event] = await db.query(`
            SELECT * FROM PROGRAMMES WHERE programme_id = ? AND organization_id = ?
        `, [id, organization_id]);

        if (event.length === 0) {
            return res.status(404).json({ message: "Event not found or unauthorized" });
        }

        // Delete the event
        await db.query(`DELETE FROM PROGRAMMES WHERE programme_id = ?`, [id]);

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
};


// exports.getEventVolunteers = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const [volunteers] = await db.query(`
//             SELECT v.volunteer_id, v.name, v.email, v.phone, v
//             FROM VOLUNTEER_PROGRAMMES vp
//             JOIN VOLUNTEER v ON vp.volunteer_id = v.volunteer_id
//             WHERE vp.programme_id = ?
//         `, [id]); 
//     }catch(error){
//         res.status(500).json({ message: "Error fetching volunteers", error });
//     }   
// }