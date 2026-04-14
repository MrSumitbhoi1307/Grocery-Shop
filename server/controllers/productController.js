import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// ✅ ADD PRODUCT
export const addProduct = async (req, res) => {
    try {
        if (!req.body.productData) {
            return res.json({ success: false, message: "No product data provided" });
        }

        const parsedData = JSON.parse(req.body.productData);

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: "Please upload image" });
        }

        const imageUrls = [];

        for (const file of req.files) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(file.buffer);
                });

                imageUrls.push(result.secure_url);

            } catch (err) {
                return res.json({
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        const newProduct = new Product({
            ...parsedData,
            image: imageUrls,
            inStock: true, // ✅ default stock
            date: Date.now()
        });

        await newProduct.save();

        res.json({
            success: true,
            message: "Product Added Successfully!"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// ✅ GET ALL PRODUCTS
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ GET SINGLE PRODUCT
export const productById = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await Product.findById(id);

        res.json({ success: true, product });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ CHANGE STOCK (FIXED)
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            { inStock },
            { new: true }
        );

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({
            success: true,
            message: `Product marked as ${inStock ? "In Stock" : "Out of Stock"}`
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};