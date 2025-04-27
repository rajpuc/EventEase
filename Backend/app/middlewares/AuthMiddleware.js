import userModel from "../models/UserModel.js";
import { verifyToken } from "../utility/TokenUtility.js";

export const isLoggedIn = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                status:"failed",
                message:"Unauthorized: Please Login First",
                error:"Unauthorized: No token provided"
            })
        }
        const decoded = verifyToken(token);
        if(!decoded){
            return res.status(401).json({
                status:"failed",
                message:"Unauthorized: Please Login First",
                error:"Unauthorized: Invalid token"
            })
        }
        const user = await userModel.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({
                status:"failed",
                message:"Unauthorized: Please Login First",
                error:"Unauthorized: User not found."
            })
        }

        req.user=user;
        next();
    }catch(error){
        console.log("Is Logged in error : ",error.message);
        res.status(500).json({
            status:"failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}