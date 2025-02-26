const { getData, updateProfile, getMyEvents } = require("../controllers/user")
const user = require("express").Router()


// auth.route("/login").post(login)
user.route("/user").get(getData).post(updateProfile)
user.route("/user/events").get(getMyEvents)



module.exports = {user}