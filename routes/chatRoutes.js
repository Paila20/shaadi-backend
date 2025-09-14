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

export default router;
