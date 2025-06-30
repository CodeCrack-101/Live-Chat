import jwt from "jsonwebtoken";
import User from "../Models/Usermodel.js";

export const protectroute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ msg: "No token provided" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userid).select("-password");

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ msg: "Invalid token" });
    }
};
