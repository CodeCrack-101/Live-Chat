// ✅ Fixed usercontroller.js

import bcrypt from 'bcryptjs';
import User from '../Models/Usermodel.js';
import { generatetoken } from '../LIb/Utils.js';
import cloudinary from '../LIb/Cloudnary.js';

// Signup User
export const signup = async (req, res) => {
    const { email, fullname, password, bio } = req.body;
    try {
        if (!fullname || !email || !password || !bio) {
            return res.json({
                success: false,
                message: "Please fill in all fields"
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

 const newUser = await User.create({
  email,
  password: hashedPassword,
  fullname,
  bio
});


        const token = generatetoken(newUser._id);
        newUser.save();

        return res.json({
            success: true,
            user: newUser,
            message: "Account created successfully",
            token
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: "Error creating account"
        });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userdata = await User.findOne({ email });

        if (!userdata) {
            return res.json({
                success: false,
                message: "Email not found"
            });
        }

        const isMatch = await bcrypt.compare(password, userdata.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

const token = generatetoken(userdata._id); // ✅ use this instead of generatetoken
        return res.json({
            success: true,
            user:userdata,
            message: "Logged in successfully",
            token
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: "Error logging in"
        });
    }
};

// Authenticated User
export const authenticate = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};

// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullname } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullname },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullname, profilePic: upload.secure_url },
                { new: true }
            );
        }

        return res.json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: "Error updating profile"
        });
    }
};
