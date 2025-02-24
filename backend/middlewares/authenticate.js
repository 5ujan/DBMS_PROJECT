const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
	const token = req.header("Authorization");
	// console.log(jwt.verify(token, process.env.JWT_SECRET))
	

	if (!token) return res.status(401).json({ message: "No token provided" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		console.log("Verified at", new Date().toLocaleTimeString())
		next();
	} catch (err) {
		// console.error("Error in authenticate: ", err);
		res.status(401).json({ message: "Invalid token" });
	}
};


module.exports= {authenticate}