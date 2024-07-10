const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const genreRoutes = require("./routes/genreRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const commentRoutes = require("./routes/commentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const imageRoutes = require("./routes/imageRoutes");
const miniImageRoutes = require("./routes/miniImageRoutes");

const app = express();
const port = process.env.PORT || 4000;

// MIDDLEWARES
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// ROUTES
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/genres", genreRoutes);
app.use("/products", productRoutes);
app.use("/ratings", ratingRoutes);
app.use("/comments", commentRoutes);
app.use("/orders", orderRoutes);
app.use("/reports", reportRoutes);
app.use("/images", imageRoutes);
app.use("/minis", miniImageRoutes);
mongoose.set("strictQuery", false);

// STRIPE CONNECTION
app.post("/create-payment-intent", async (req, res) => {
	const { price } = req.body;

	const paymentIntent = await stripe.paymentIntents.create({
		amount: Number(price),
		currency: "usd",
		automatic_payment_methods: {
			enabled: true,
		},
	});

	res.status(200).send({
		clientSecret: paymentIntent.client_secret,
	});
});

mongoose.connect(process.env.MONGODB_URL, () => {
	console.log("Successfully connected to database.");
});
app.get("/TestImages/:source", (req, res) => {
	const imageUrl = req.params.source;

	const imageList = fs.readdirSync("./TestImages");
	res.sendFile(`${__dirname}/TestImages/${imageUrl}`);
});

// Set up storage engine
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./TestImages/"); // Set your desired upload folder
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); // Append extension
	},
});

// Initialize upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 }, // Set file size limit (1MB here)
}).single("file");

app.delete("/deleteImage", (req, res) => {
	console.log(req.body.path);
	const filePath = req.body.path; // Assuming the path is sent in the request body
	const result = deleteImage(filePath);

	if (result) {
		res.status(200).json({ message: "File deleted successfully." });
	} else {
		res.status(500).json({ error: "Error deleting file." });
	}
});

function deleteImage(filePath) {
	if (!filePath) {
		console.error("Path to delete must be provided.");
		return false;
	}

	const fileBrokenDown = filePath.split("/");
	const actualFile = fileBrokenDown.at(-1);
	const actualFolder = fileBrokenDown.at(-2);
	const relativeFilePath = path.join(__dirname, actualFolder, actualFile);

	console.log(relativeFilePath);

	// Ensure the file exists before attempting to delete
	if (!fs.existsSync(relativeFilePath)) {
		console.error("File not found.");
		return false;
	}

	// Delete the file
	try {
		fs.unlinkSync(relativeFilePath);
		console.log("File deleted successfully:", relativeFilePath);
		return true;
	} catch (err) {
		console.error("Error deleting file:", err);
		return false;
	}
}

// Route for handling image upload
app.post("/image/upload", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		res.status(200).json({
			message: "Image uploaded successfully",
			file: req.file,
		});
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}.`);
});

("../TestImages/1.jpg");
