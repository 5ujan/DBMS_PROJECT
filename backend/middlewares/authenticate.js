const { getData } = require("../controllers/user");
const jwt = require("jsonwebtoken");
const db = require("../connectDB");

const authenticate = async (req, res, next) => {
	const token = req.header("Authorization");
	// console.log(jwt.verify(token, process.env.JWT_SECRET))

	if (!token) return res.status(401).json({ message: "No token provided" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const [vol] = await db.query(
			"SELECT * FROM VOLUNTEER natural join ADMIN WHERE volunteer_id = ?",
			[decoded.id]
		);
		const [org] = await db.query(
			"SELECT * FROM ORGANIZATION natural join ADMIN WHERE organization_id = ?",
			[decoded.id]
		);
		console.log({vol, org})
		
		req.user = decoded;

		if([...vol, ...org].length !== 0) {
			req.user.role = "admin";
		}
		console.log("User	", req.user);
		console.log("Verified at", new Date().toLocaleTimeString());
		next();
	} catch (err) {
		console.error("Error in authenticate: ", err);
		res.status(401).json({ message: "Invalid token" });
	}
};

module.exports = { authenticate };


