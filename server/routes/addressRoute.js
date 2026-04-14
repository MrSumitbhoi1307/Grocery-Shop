import express from 'express'
import authUser from '../middlewares/authUser.js'
import { addAddress, getAddress } from '../controllers/addressController.js'  // FIX: added getAddress to import

const addressRouter = express.Router()

addressRouter.post('/add', authUser, addAddress)
addressRouter.get('/get', authUser, getAddress)   // FIX: post → get, '/add' → '/get'

export default addressRouter