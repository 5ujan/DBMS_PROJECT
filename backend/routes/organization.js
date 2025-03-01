const {getOrganizationById, makeDonation} = require("../controllers/organization");
const organization = require("express").Router();

organization.route("/organization/:id").get(getOrganizationById);
organization.route("/organization/:id/donate").post(makeDonation);

module.exports = {organization}