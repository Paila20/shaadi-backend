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


router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Validate and cast userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ✅ Find all chats where user is sender or receiver
    const chats = await Chat.find({
      $or: [{ from: userObjectId }, { to: userObjectId }],
    }).sort({ createdAt: -1 });

    if (!chats.length) {
      return res.json({ success: true, users: [] });
    }

    // ✅ Map unique chat partners with last message
    const userMap = {};
    chats.forEach((chat) => {
      const otherUserId =
        chat.from.toString() === userId ? chat.to : chat.from;
      const key = otherUserId.toString();
      if (!userMap[key]) {
        userMap[key] = {
          userId: otherUserId,
          lastMessage: chat,
        };
      }
    });

    const uniqueUserIds = Object.values(userMap).map((u) =>
      new mongoose.Types.ObjectId(u.userId)
    );

    const users = await User.find({ _id: { $in: uniqueUserIds } });

    const result = users.map((u) => ({
      _id: u._id,
      name: u.name,
      image: u.image,
      gender: u.gender,
      isOnline: u.isOnline || false,
      lastMessage: userMap[u._id.toString()]?.lastMessage || null,
    }));

    res.json({ success: true, users: result });
  } catch (err) {
    console.error("Error fetching chat users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
