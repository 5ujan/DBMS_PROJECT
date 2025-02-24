const { getAllDonors, getDonorById, createDonor, deleteDonor } = require("../controllers/donor");
const donor = require("express").Router();

donor.route("/donors").get(getAllDonors).post(createDonor);
donor.route("/donors/:id").get(getDonorById).delete(deleteDonor);

module.exports = { donor };
