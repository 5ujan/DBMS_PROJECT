const {getOrganizationById} = require("../controllers/organization");
const organization = require("express").Router();

organization.route("/organization/:id").get(getOrganizationById);

module.exports = {organization}