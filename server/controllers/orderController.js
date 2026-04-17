import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            payment: false,
            date: Date.now()
        });

        return res.json({ success: true, message: "Order Placed successfully" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Get Orders by User : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        // 🔥 FIX: use req.user.id (set by authUser middleware via JWT)
        const userId = req.user.id;

        const orders = await Order.find({ userId })
            .populate("address")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log("getUserOrders Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get All Orders (Seller) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log("getAllOrders Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};