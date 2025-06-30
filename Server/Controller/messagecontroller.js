// controllers/messageController.js

import Message from '../Models/message.js';
import User from '../Models/Usermodel.js';
import cloudinary from '../LIb/Cloudnary.js';
import { io, usersockitmap } from '../server.js';

// ✅ Get all users for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenmessage: unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error fetching users" });
  }
};

// ✅ Get all messages with a specific user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    // ✅ Mark received messages as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    res.json({ success: true, message: messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error fetching messages" });
  }
};

// ✅ Mark one message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Send a message (with optional image)
// controllers/messageController.js
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text, image } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "receiverId is required" });
    }

    let imageUrl = "";
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
      });
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = usersockitmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newmessage: newMessage });
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
};

