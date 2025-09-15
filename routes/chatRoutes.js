import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

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

// routes/chatRoutes.js
router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({
      $or: [{ from: userId }, { to: userId }],
    }).sort({ createdAt: -1 });

    // Get unique user IDs except current user
    const userMap = {};
    chats.forEach((chat) => {
      const otherUserId = chat.from.toString() === userId ? chat.to : chat.from;
      if (!userMap[otherUserId]) {
        userMap[otherUserId] = {
          userId: otherUserId,
          lastMessage: chat,
        };
      }
    });

    const users = await User.find({ _id: { $in: Object.keys(userMap) } });

    const result = users.map((u) => ({
      _id: u._id,
      name: u.name,
      image: u.image,
      gender: u.gender,
      isOnline: u.isOnline || false, // if you track this in DB
      lastMessage: userMap[u._id]?.lastMessage || null,
    }));

    res.json({ users: result });
  } catch (err) {
    console.error("Error fetching chat users:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
