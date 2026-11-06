import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);

        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                message: "No token provided, authorization denied",
            });
        }

        console.log("Token:", req.cookies.token);
        
        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded Token:", verifyToken);

        if (!verifyToken) {
            return res.status(401).json({
                message: "Invalid token, authorization denied",
            });
        }

        req.userId = verifyToken.userId;

        next();
    } catch (error) {
        console.log("isAuth Error:", error);

        return res.status(401).json({
            message: error.message,
        });
    }
};

export default isAuth;