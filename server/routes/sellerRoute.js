import express from 'express';
// 1. FIX: sellerLogout ko import list mein add kiya
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js'; 
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

// Route: /api/seller/login
sellerRouter.post('/login', sellerLogin);

// Route: /api/seller/is-auth 
// (Pehle authSeller middleware check karega, phir controller chalega)
sellerRouter.get('/is-auth', authSeller, isSellerAuth);

// Route: /api/seller/logout
// (Testing ke liye GET rakha hai, browser se bhi check kar sakte ho)
sellerRouter.get('/logout', authSeller, sellerLogout); 


export default sellerRouter;