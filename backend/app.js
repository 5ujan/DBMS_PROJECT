require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("./connectDB");
const {authenticate} = require("./middlewares/authenticate");
const fileupload = require("express-fileupload");


const { auth } = require("./routes/auth.js");
const { user } = require("./routes/user");
const {event} = require("./routes/event.js");
const { donor } = require("./routes/donor.js");
const {skill} = require("./routes/skill.js")
const {image} = require("./routes/image")
const {admin} = require("./routes/admin.js")

const app = express();
app.use(express.json());
app.use(cors("*"));

app.get("/api/health", async (req, res) => {
    res.status(200).json({ msg: "okay" });
});

app.use(
    fileupload({
      useTempFiles: true,
    })
  );

// No authentication middleware needed for auth routes
app.use("/api", auth);  // Auth routes (login, register, etc.)

// Apply authentication middleware for user routes
app.use("/api", authenticate);  // Authenticate before user routes
app.use("/api", user, event, donor, skill, image, admin);  // User routes (accessible only after authentication)

app.listen(5555, () => {
    console.log("server started on port", 5555);
});

const start = async () => {
    try {
      let [res] = await db.query("SELECT * from VOLUNTEER")
      if(res.length){
        console.log("CONNECTED TO DB SUCCESSFULLY")
      }
    } catch (err) {
        console.error("Error during database connection: ", err);
    }
};
start();
