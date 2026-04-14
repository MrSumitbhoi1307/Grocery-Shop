import jwt from 'jsonwebtoken';

// ✅ Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        // ✅ Trim spaces (VERY IMPORTANT)
        email = email?.trim();
        password = password?.trim();

        // ✅ Debug logs (remove later)
        console.log("ENV:", process.env.SELLER_EMAIL, process.env.SELLER_PASSWORD);
        console.log("INPUT:", email, password);

        // ✅ Case-insensitive email check
        if (
            email === process.env.SELLER_EMAIL &&
            password === process.env.SELLER_PASSWORD
        ) {
            const token = jwt.sign(
                { email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: false, // ⚠️ IMPORTANT for localhost
                sameSite: 'lax', // ⚠️ FIXED (better for dev)
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
                success: true,
                message: "Logged In Successfully"
            });

        } else {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

    } catch (error) {
        console.log("LOGIN ERROR:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Seller isAuth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: "Seller Authorized"
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Logout seller
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        return res.json({
            success: true,
            message: "Logged Out Successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};