import express from 'express'
import authUser from '../middlewares/authUser.js'
import { getAllOrders, getUserOrders, placeOrderCOd } from '../controllers/orderController.js'
import authSeller from '../middlewares/authSeller.js'

const orderRouter = express.Router()

orderRouter.post('/cod', authUser, placeOrderCOd)      // FIX: orderROuter → orderRouter
orderRouter.get('/user', authUser, getUserOrders)       // FIX: orderROuter → orderRouter
orderRouter.get('/seller', authSeller, getAllOrders)    // FIX: getUserOrders → getAllOrders

export default orderRouter