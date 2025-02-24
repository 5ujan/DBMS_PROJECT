const express = require("express");
const {
  getAllSkills,
  getSkillsByVolunteerId,
  addSkillToVolunteer,
  removeSkillFromVolunteer,
} = require("../controllers/skill");

const skill = express.Router();

skill.route("/skills").get(getAllSkills);
skill.route("/volunteer/:id/skills").get(getSkillsByVolunteerId);
skill.route("/volunteer/skill").post(addSkillToVolunteer);
skill.route("/volunteer/:volunteer_id/skill/:skill_name").delete(removeSkillFromVolunteer);

module.exports = { skill };
