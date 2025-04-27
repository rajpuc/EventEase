import userModel from "../models/UserModel.js";
import cloudinary from "../utility/CloudinaryUtility.js";
import { validationResult } from "express-validator";
import { hashPassword, passComparison } from "../utility/PasswordUtility.js";
import { generateToken } from "../utility/TokenUtility.js";
import { JWT_EXPIRATION_TIME } from "../config/config.js";
import UserModel from "../models/UserModel.js";

export const login = async (req, res) => {
  try{
    const {email, password} = req.body;

    const user = await UserModel.findOne({email});

    // 401 Unauthorized: Used when authentication fails (e.g., incorrect email/password).
    // 400 Bad Request: Used for generic input validation errors.
    // 403 Forbidden: Used when the user is authenticated but lacks permission.
    if(!user){
      return res.status(401).json({
        status:"failed",
        message:"Invalid email or password",
        error:"Invalid email or password"
      })
    }

    const isPasswordValid = await passComparison(password, user.password);

    if(!isPasswordValid){
      return res.status(401).json({
        status:"failed",
        message:"Invalid email or password",
        error:"Invalid email or password"
      })
    }

    //Generate JWT key
    const token = generateToken(user._id, user.email);

    //Send token through cookies
    const tokenOptions = {
      httpOnly: true,
      secure:process.env.NODE_ENV === "production",
      sameSite:"strict", 
      maxAge:JWT_EXPIRATION_TIME * 1000
    }

    res.cookie("token", token, tokenOptions)
   
    res.status(200).json({
      status:"success",
      message:"Successfully Login",
      data:{
        _id:user._id,
        name:user.name,
        email:user.email,
      }
    });
  }catch(error){
    console.log("Error in Login Controller : ",error.message);
    res.status(500).json({
      status:"failed",
      message:"Internal server error",
      error:error.message
    })
  }
};

export const registration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const groupedErrors = errors.array().reduce((acc, error) => {
        if (!acc[error.path]) {
          acc[error.path] = [];
        }
        acc[error.path].push(error.msg);
        return acc;
      }, {});

      // Send a 400 Bad Request status with validation errors
      return res.status(400).json({
        status: "failed",
        message: "Serverside Validation Error",
        error: groupedErrors,
      });
    }

    const {name,email,password} = req.body;

    //Check the user is already exist or not
    const existingUser = await userModel.findOne({email});
    if(existingUser){
      return res.status(400).json({
        status:"failed",
        message: "Email is already registered",
        error:"Email is already registered"
      })
    }

    //Hashed Password
    const hashedPassword = await hashPassword(password);

    let createdUser = await UserModel.create({
      name,
      email,
      password:hashedPassword,
      
    });

    return res.status(201).json({
      status:"success",
      message:"Successfully registered",
      data:{
        _id:createdUser._id,
        name:createdUser.name,
        email:createdUser.email,
    }});
  } catch (error) {
    console.log("Error in Registration Controller: " + error.message);

    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error:error.message
    });
  }
};

export const uploadDataToCloud = async (req, res) => {
  try {
    const { file } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(file);
    return res.status(200).json({
      status:"success",
      message:"File uploaded successfully.",
      data: uploadResponse.secure_url 
    });
  } catch (error) {
    console.log('Error in uploadDataToCloud Controller: '+error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const checkAuth = async (req, res)=>{
  try{
    res.status(200).json({
      status:"success",
      message:"Successfully retrieved user",
      data:req.user,
    });
  }catch(error){
    console.log('Error in checkAuth Controller: '+error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const logout = (req,res)=>{
  try{
    res.cookie("token","",{maxAge:0});
    res.status(200).json({
      status:"success",
      message:"Successfully logout."
    })
  }catch(error){
    console.log('Error in logout Controller: '+error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}