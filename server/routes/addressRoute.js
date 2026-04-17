import express from 'express'
import authUser from '../middlewares/authUser.js'
import { addAddress, getAddress } from '../controllers/addressController.js'

const addressRouter = express.Router()

// 🔥 FORCE MIDDLEWARE ON ALL ROUTES
addressRouter.use(authUser)

addressRouter.post('/add', authUser, addAddress)
addressRouter.get('/get', authUser, getAddress)

export default addressRouter