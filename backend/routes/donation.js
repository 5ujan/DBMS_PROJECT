const { getAllDonations, getDonationById, getDonors, getDonationsByOrganization } = require("../controllers/donation");
const donation = require("express").Router();

donation.route("/donation").get(getAllDonations);
donation.route("/donation/:id").get(getDonationById);
donation.route("/donation/organization/:id").get(getDonationsByOrganization);
donation.route("/donors/").get(getDonors);

module.exports = { donation };
