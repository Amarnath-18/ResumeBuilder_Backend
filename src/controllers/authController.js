import { User } from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Remove password from response(gpt)
    const { password: _, ...userData } = user._doc;

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: userData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    console.log('Setting cookie with token:', token ? 'Token generated' : 'No token');

    // Enhanced cookie configuration for production
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      httpOnly: true,
      secure: isProduction, // Use secure cookies in production (HTTPS required)
      sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
      domain: isProduction ? undefined : undefined, // Let browser set domain automatically
    });

    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      data: userData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });
        
        return res.status(200).json({
            success: true,
            message: "User logged out successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};

export const getCurrentUser = async (req , res)=>{
  try {
    const {userId} = req;
    const user = await User.findById(userId).populate('resumes');
    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      success:true,
      message:"current User fetched sucessfully",
      data:userData
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message,
    })
  }
}
