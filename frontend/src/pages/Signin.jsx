import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiServices from "../frontend-lib/api/ApiServices";
import { useStore } from "../store/store";
import { showToast } from "../utils/toasts";

export default function Signin() {
	const { user, setUser } = useStore();
	const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register forms
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		dob: "",
		role: "individual",
		gender: "male",
		phone: "", // Added phone field
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Check for valid token on component mount
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			console.log({ token });
			ApiServices.getUser()
				.then((user) => {
					setUser(user);
					navigate("/dashboard");
				})
				.catch(() => console.log("Invalid token or expired"));
		}
	}, [navigate]);

	// Handle form field changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Handle form submission (login or register)

	// Handle form submission (login or register)
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let response;
			if (isLogin) {
				// Login request
				console.log(formData.email, formData.password);
				response = await ApiServices.login({
					email: formData.email,
					password: formData.password,
				});
			} else {
				// Register request (Ensure proper date format)
				const formattedDob = formData.dob
					? formData.dob?.split("T")[0]
					: "";
				response = await ApiServices.register({
					...formData,
					dob: formattedDob,
				});
			}
			console.log(response);
			// Token is automatically stored in ApiServices, so no need to set it manually
			if (response) {
				navigate("/dashboard"); // Navigate to home page on successful login/registration
				showToast("Login successful", "success");
			} else showToast("Login failed", "error");
		} catch (err) {
			setError("Something went wrong, please try again.");
			console.error(err);
		}
	};

	return (
		<div className="flex h-screen bg-black w-screen">
			{/* Sidebar */}
			<div className="w-1/4 bg-dark-green flex flex-col justify-center items-center p-8">
				<h1 className="absolute top-10 bg-dark-green text-4xl text-black font-bold justify-self-start">
					Sahayog
				</h1>
				<h1 className="text-3xl text-black bg-dark-green font-bold justify-self-center">
					Welcome
				</h1>
				<p className="text-black bg-dark-green mt-4 text-center">
					{isLogin
						? "Sign in to access your account."
						: "Create an account to get started."}
				</p>
			</div>

			{/* Main Content */}
			<div className="w-3/4 flex justify-center items-center">
				<div className="bg-black p-10 rounded-xl shadow-xl w-full max-w-md border border-dark-green">
					<h1 className="text-3xl text-center mb-6 font-semibold text-dark-green">
						{isLogin ? "Login" : "Register"}
					</h1>

					{error && (
						<p className="text-red-500 text-center mb-4">{error}</p>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{!isLogin && (
							<div className="flex items-center justify-between">
								<span className="text-sm text-dark-green font-medium">
									Register as:
								</span>
								<div
									className={`w-24 h-8 flex items-center bg-dark-green rounded-full p-1 cursor-pointer ${
										formData.role === "organization"
											? "justify-end"
											: "justify-start"
									}`}
									onClick={() =>
										setFormData((prev) => ({
											...prev,
											role:
												prev.role === "individual"
													? "organization"
													: "individual",
										}))
									}
								>
									<div className="w-10 h-6 bg-black rounded-full flex items-center justify-center text-xs text-dark-green font-semibold">
										{formData.role === "individual"
											? "Ind"
											: "Org"}
									</div>
								</div>
							</div>
						)}

						{/* Common fields */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm text-dark-green font-medium"
							>
								Email
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={formData.email}
								onChange={handleInputChange}
								required
								className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm text-dark-green font-medium"
							>
								Password
							</label>
							<input
								type="password"
								name="password"
								id="password"
								value={formData.password}
								onChange={handleInputChange}
								required
								className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
							/>
						</div>

						{!isLogin && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Fields for Individual */}
								{formData.role === "individual" && (
									<>
										<div>
											<label
												htmlFor="name"
												className="block text-sm text-dark-green font-medium"
											>
												Full Name
											</label>
											<input
												type="text"
												name="name"
												id="name"
												value={formData.name}
												onChange={handleInputChange}
												required
												className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
											/>
										</div>
										<div>
											<label
												htmlFor="dob"
												className="block text-sm text-dark-green font-medium"
											>
												Date of Birth
											</label>
											<input
												type="date"
												name="dob"
												id="dob"
												value={formData.dob}
												onChange={handleInputChange}
												required
												className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
											/>
										</div>
										<div>
											<label
												htmlFor="phone"
												className="block text-sm text-dark-green font-medium"
											>
												Phone Number
											</label>
											<input
												type="tel"
												name="phone"
												id="phone"
												value={formData.phone}
												onChange={handleInputChange}
												required
												className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
											/>
										</div>
										<div className="col-span-2 flex items-center justify-between">
											<span className="text-sm text-dark-green font-medium">
												Gender:
											</span>
											<div
												className={`w-32 h-8 flex items-center bg-dark-green rounded-full p-1 cursor-pointer ${
													formData.gender === "female"
														? "justify-end"
														: "justify-start"
												}`}
												onClick={() =>
													setFormData((prev) => ({
														...prev,
														gender:
															prev.gender ===
															"male"
																? "female"
																: "male",
													}))
												}
											>
												<div className="w-12 h-6 bg-black rounded-full flex items-center justify-center text-xs text-dark-green font-semibold">
													{formData.gender === "male"
														? "Male"
														: "Female"}
												</div>
											</div>
										</div>
									</>
								)}

								{/* Fields for Organization */}
								{formData.role === "organization" && (
									<>
										<div>
											<label
												htmlFor="organizationName"
												className="block text-sm text-dark-green font-medium"
											>
												Organization Name
											</label>
											<input
												type="text"
												name="organizationName"
												id="organizationName"
												value={
													formData.organizationName
												}
												onChange={handleInputChange}
												required
												className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
											/>
										</div>
										<div>
											<label
												htmlFor="establishedDate"
												className="block text-sm text-dark-green font-medium"
											>
												Established Date
											</label>
											<input
												type="date"
												name="establishedDate"
												id="establishedDate"
												value={formData.establishedDate}
												onChange={handleInputChange}
												required
												className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
											/>
										</div>
										<div>
											<label
												htmlFor="contactEmail"
												className="block text-sm text-dark-green font-medium"
											>
												Contact Email
											</label>
											<input
												type="email"
												name="contactEmail"
												id="contactEmail"
												value={formData.contactEmail}
												onChange={handleInputChange}
												required
												className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
											/>
										</div>
										<div>
											<label
												htmlFor="contactPhone"
												className="block text-sm text-dark-green font-medium"
											>
												Contact Phone
											</label>
											<input
												type="tel"
												name="contactPhone"
												id="contactPhone"
												value={formData.contactPhone}
												onChange={handleInputChange}
												required
												className="w-full p-2 border border-dark-green rounded-md bg-black text-white focus:outline-none focus:ring focus:ring-dark-green text-sm"
											/>
										</div>
									</>
								)}
							</div>
						)}

						<button
							type="submit"
							className="w-full bg-dark-green text-black p-2 rounded-md transition duration-300 hover:bg-opacity-90 text-sm"
						>
							{isLogin ? "Login" : "Register"}
						</button>
					</form>

					<div className="text-center mt-4">
						<span className="text-gray-400">
							{isLogin
								? "Don't have an account?"
								: "Already have an account?"}
						</span>
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="text-dark-green underline ml-2"
						>
							{isLogin ? "Register" : "Login"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
