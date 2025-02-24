const db = require("../connectDB");

// Fetch all skills
const getAllSkills = async (req, res) => {
  try {
    const query = "SELECT * FROM SKILLS";
    const [skills] = await db.query(query);
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

// Get skills by volunteer ID
const getSkillsByVolunteerId = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT s.skill_id, s.skill_name, vs.proficiency_level
      FROM SKILLS s
      JOIN VOLUNTEER_SKILLS vs ON s.skill_id = vs.skill_id
      WHERE vs.volunteer_id = ?`;
    const [skills] = await db.query(query, [id]);
    res.json(skills);
  } catch (error) {
    console.error("Error fetching volunteer skills:", error);
    res.status(500).json({ message: "Failed to fetch volunteer skills" });
  }
};

// Add a skill to a volunteer
const addSkillToVolunteer = async (req, res) => {
  const { volunteer_id, skill_id, proficiency_level } = req.body;
  try {
    const query = `
      INSERT INTO VOLUNTEER_SKILLS (volunteer_id, skill_id, proficiency_level)
      VALUES (?, ?, ?)`;
    await db.query(query, [volunteer_id, skill_id, proficiency_level]);
    res.status(201).json({ message: "Skill added to volunteer successfully" });
  } catch (error) {
    console.error("Error adding skill to volunteer:", error);
    res.status(500).json({ message: "Failed to add skill" });
  }
};

// Remove a skill from a volunteer
const removeSkillFromVolunteer = async (req, res) => {
  const { volunteer_id, skill_id } = req.params;
  try {
    const query = `
      DELETE FROM VOLUNTEER_SKILLS
      WHERE volunteer_id = ? AND skill_id = ?`;
    await db.query(query, [volunteer_id, skill_id]);
    res.json({ message: "Skill removed from volunteer successfully" });
  } catch (error) {
    console.error("Error removing skill from volunteer:", error);
    res.status(500).json({ message: "Failed to remove skill" });
  }
};

module.exports = { getAllSkills, getSkillsByVolunteerId, addSkillToVolunteer, removeSkillFromVolunteer };
