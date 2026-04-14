import User from "../models/User.js"   // FIX: added .js extension
import Address from "../models/Address.js"  // FIX: added .js extension

// Update User CartData: /api/cart/update
export const updateCart = async (req, res) => {   // FIX: requestAnimationFrame → req
    try {
        const { userId, cartItems } = req.body
        await User.findByIdAndUpdate(userId, { cartItems })
        res.json({ success: true, message: "Cart updated" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })  // FIX: successs → success
    }
}

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body  // FIX: ( ) → { } destructuring
        await Address.create({ ...address, userId })
        res.json({ success: true, message: "Address added successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Address : /api/address/get
export const getAddress = async (req, res) => {  // FIX: asynce → async, arrow fn syntax
    try {
        const { userId } = req.body
        const address = await Address.find({ userId })
        res.json({ success: true, address })  // FIX: addAddress → address
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}