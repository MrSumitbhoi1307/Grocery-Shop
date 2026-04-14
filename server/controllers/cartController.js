import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
        console.log("🔥 CART API HIT");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);

        const userId = req.user?.id;
        const { cartItems } = req.body;

        // ❗ safety checks
        if (!userId) {
            return res.json({
                success: false,
                message: "User ID missing"
            });
        }

        if (!cartItems) {
            return res.json({
                success: false,
                message: "Cart items missing"
            });
        }

        // 🔥 FIND USER
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            console.log("❌ USER NOT FOUND IN DB");
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // ❌🔥 MOST IMPORTANT FIX (EMPTY CART IGNORE)
        if (Object.keys(cartItems).length === 0) {
            console.log("⚠️ EMPTY CART RECEIVED → IGNORE UPDATE");

            return res.json({
                success: true,
                cartItems: existingUser.cartItems
            });
        }

        // 🔥 UPDATE CART
        existingUser.cartItems = cartItems;

        // 🔥 FORCE SAVE (important for object update)
        existingUser.markModified("cartItems");

        await existingUser.save();

        // 🔥 DOUBLE CHECK
        const updatedUser = await User.findById(userId);

        console.log("✅ SAVED IN DB:", updatedUser.cartItems);

        res.json({
            success: true,
            message: "Cart updated",
            cartItems: updatedUser.cartItems
        });

    } catch (error) {
        console.log("❌ ERROR:", error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};

