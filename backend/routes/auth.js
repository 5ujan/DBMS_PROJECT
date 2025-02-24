const {login, register} = require("../controllers/auth")
const auth = require("express").Router()


auth.route("/login").post(login)
auth.route("/register").post(register)

module.exports= {auth}