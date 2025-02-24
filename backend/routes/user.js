const { getData, updateProfile } = require("../controllers/user")
const user = require("express").Router()


// auth.route("/login").post(login)
user.route("/user").get(getData).post(updateProfile)


module.exports = {user}