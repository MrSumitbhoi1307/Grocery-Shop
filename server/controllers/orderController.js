import Order from "../models/Order.js"   // FIX: 'order' → 'Order' (capital)
import Product from "../models/Product.js"

// Place Order COD : /api/order/cod
export const placeOrderCOd = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        amount += Math.floor(amount * 0.02)

        await Order.create({          // FIX: order.create → Order.create
            userId,
            items,
            amount,
            address,
            paymentType: "COD"        // FIX: "COd" → "COD"
        })
        return res.json({ success: true, message: "Order Placed successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Get Orders by User Id : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body          // FIX: uerId → userId
        const orders = await Order.find({    // FIX: order → Order
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address") // FIX: item → items
          .sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get All Orders (for seller/admin) : /api/order/seller
export const getAllOrders = async (req, res) => {  // FIX: getAllOrder → getAllOrders
    try {
        const orders = await Order.find({           // FIX: order → Order
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address")        // FIX: item → items
          .sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}