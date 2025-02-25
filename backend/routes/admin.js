const admin = require("express").Router()
const { getStats,getAllOrganizations, getAllVolunteers, updateUserRole } =require("../controllers/admin")
const { getAllEvents } = require("../controllers/event")

const adminAuth = (async (req, res, next) => {
    if(!req.user || req.user.role !== "admin"){
        return res.status(401).json({message: "Unauthorized"})
    }
    next()
});
admin.use(adminAuth)
admin.route("/admin/stats").get(getStats)
admin.route("/admin/organization").get(getAllOrganizations) 
admin.route("/admin/volunteer").get(getAllVolunteers)
admin.route("/admin/event").get(getAllEvents)
// admin.route("/admin/event/:id").delete(deleteEvent)
// admin.route("/admin/organization/:id").delete(deleteOrganization)
// admin.route("/admin/volunteer/:id").delete(deleteVolunteer)
admin.route("/admin/update_user_role").post(updateUserRole)




module.exports = {admin}