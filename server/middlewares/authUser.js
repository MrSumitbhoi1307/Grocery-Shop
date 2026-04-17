import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized Login Again"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.json({
                success: false,
                message: "Invalid Token"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default authUser;