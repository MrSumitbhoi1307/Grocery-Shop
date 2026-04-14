import express from 'express';
import { upload } from '../configs/multer.js'; // ✅ now works
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

// test route
productRouter.get('/test', (req, res) => {
    res.json({ success: true, message: 'Product route is working fine!' });
});

// ✅ Upload images (max 4)
productRouter.post('/add', upload.array('images', 4), addProduct);

// ✅ Get all products
productRouter.get('/list', productList);

// ✅ Get product by ID
productRouter.post('/id', productById);

// ✅ Update stock (protected)
productRouter.post('/stock', changeStock);

export default productRouter;