import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
    try {
        const { sellerToken } = req.cookies;

        // ❌ No token → block access
        if (!sellerToken) {
            return res.json({
                success: false,
                message: "Not Authorized. Please Login"
            });
        }

        // ✅ Verify token
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

        if (!decoded.email) {
            return res.json({
                success: false,
                message: "Invalid Token"
            });
        }

        next(); // ✅ Allow access only if token valid

    } catch (error) {
        return res.json({
            success: false,
            message: "Authentication Failed"
        });
    }
};

export default authSeller;