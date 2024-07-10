const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
exports.getAllProducts = async (req, res) => {
	try {
		const allProducts = await Product.find({});

		res.status(200).json({
			allProducts,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		res.status(200).json({
			product,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductsByColor = async (req, res) => {
	try {
		const products = await Product.find({
			$and: [
				{ price: { $gte: req.body.lowest } },
				{ price: { $lte: req.body.uppest } },
				{ color: req.params.color },
			],
		});

		res.status(200).json({
			products,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductsByCategoryId = async (req, res) => {
	try {
		const products = await Product.find({ category: req.params.id });

		res.status(200).json({
			products,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductsByGender = async (req, res) => {
	try {
		const products = await Product.find({
			$and: [
				{ price: { $gte: req.body.lowest } },
				{ price: { $lte: req.body.uppest } },
				{ gender: req.params.gender },
			],
		});

		res.status(200).json({
			products,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductsByPrice = async (req, res) => {
	try {
		const products = await Product.find({
			$and: [
				{ price: { $gte: req.body.lowest } },
				{ price: { $lte: req.body.uppest } },
			],
		});

		res.status(200).json({
			products,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductsByStatus = async (req, res) => {
	try {
		const products = await Product.find({ status: req.params.status });

		res.status(200).json({
			products,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductsBySearch = async (req, res) => {
	try {
		const products = await Product.find({
			name: { $regex: ".*" + req.params.search + ".*", $options: "i" },
		});

		res.status(200).json({
			products,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.getProductsByQueries = async (req, res) => {
	try {
		const products = await Product.find({
			$and: [
				{ price: { $gte: req.body.lowest } },
				{ price: { $lte: req.body.uppest } },
				{ color: req.body.color },
				{ gender: req.body.gender },
			],
		});

		res.status(200).json({
			products,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.addProduct = async (req, res) => {
	try {
		const newProduct = await Product.create(req.body);

		res.status(201).json({
			newProduct,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});

		res.status(200).json({
			product,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};
exports.deleteProduct = async (req, res) => {
	try {
		const productImageUrl = await Product.findById(req.params.id, {
			imageUrl: 1,
		});
		console.log(productImageUrl.imageUrl);
		const deleteResults = deleteImage(productImageUrl.imageUrl);
		console.log(deleteResults);
		if (deleteResults) {
			const product = await Product.findByIdAndDelete(req.params.id);

			res.status(200).json({
				product,
			});
		} else {
			throw new Error();
		}
	} catch (error) {
		res.status(400).json({
			status: "failed",
			error,
		});
	}
};

function deleteImage(filePath) {
	if (!filePath) {
		console.error("Path to delete must be provided.");
		return false;
	}
	function getRelativePath(url) {
		try {
			// Create a new URL object from the given URL string
			const urlObj = new URL(url);

			// Extract the pathname from the URL object
			const relativePath = urlObj.pathname;

			return relativePath;
		} catch (e) {
			console.error("Invalid URL:", e);
			return false;
		}
	}

	const url = filePath;
	const relativePath = getRelativePath(url);
	if (!relativePath) {
		return false;
	}

	const defragmentedDirname = __dirname.split("\\");
	defragmentedDirname.pop();
	defragmentedDirname.pop();

	let updatedDirname = defragmentedDirname.join("/");
	updatedDirname += "/api";

	console.log("This is the updated dirname " + updatedDirname);
	const relativeFilePath = path.join(updatedDirname, relativePath);

	console.log(relativeFilePath);

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
