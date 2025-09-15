import express from "express";
import Message from "../models/Message.js";
import mongoose from "mongoose"; 
import User from "../models/User.js";

const router = express.Router();

router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Find all messages where this user is sender or receiver
    const chats = await Message.find({
      $or: [{ from: objectUserId }, { to: objectUserId }],
    }).sort({ createdAt: -1 });

    if (!chats.length) {
      return res.json({ success: true, users: [] }); // no chat partners yet
    }

    const userMap = {};
    chats.forEach((chat) => {
      const otherUserId =
        chat.from.toString() === userId ? chat.to.toString() : chat.from.toString();

      if (!userMap[otherUserId]) {
        userMap[otherUserId] = chat; // store latest message
      }
    });

    const otherUserIds = Object.keys(userMap);
    const users = await User.find({ _id: { $in: otherUserIds } });

    const result = users.map((u) => ({
      _id: u._id,
      name: u.name,
      image: u.image,
      gender: u.gender,
      isOnline: u.isOnline || false,
      lastMessage: userMap[u._id.toString()],
    }));

    res.json({ success: true, users: result });
  } catch (err) {
    console.error("❌ Error fetching chat users:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// Get chat messages between two users
router.get("/:userId/:chatWithId", async (req, res) => {
  try {
    const { userId, chatWithId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: userId, to: chatWithId },
        { from: chatWithId, to: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Send a message
router.post("/send", async (req, res) => {
  try {
    const { from, to, text } = req.body;
    if (!from || !to || !text) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newMessage = await Message.create({ from, to, text });

    res.json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



export default router;
