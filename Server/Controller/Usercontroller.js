import bcrypt from 'bcryptjs';
import User from '../Models/Usermodel.js';
import { generatetoken } from '../LIb/Utils.js';
import cloudinary from '../LIb/Cloudnary.js';

// Signup
export const signup = async (req, res) => {
  try {
    const { email, fullname, password, bio } = req.body;

    if (!email || !fullname || !password || !bio) {
      return res.json({ success: false, message: "Fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      fullname,
      password: hashedPassword,
      bio
    });

    const token = generatetoken(newUser._id);

    res.json({
      success: true,
      userdata: newUser,
      token,
      message: "Account created"
    });

  } catch (error) {
    console.log("Signup Error:", error.message);
    res.json({ success: false, message: "Signup failed" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = generatetoken(user._id);

    res.json({
      success: true,
      userdata: user,
      token,
      message: "Login successful"
    });

  } catch (error) {
    console.log("Login Error:", error.message);
    res.json({ success: false, message: "Login failed" });
  }
};

// Auth check
export const authenticate = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update profile
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
        {
          bio,
          fullname,
          profilePic: upload.secure_url
        },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.log("Update Error:", error.message);
    res.json({ success: false, message: "Update failed" });
  }
};