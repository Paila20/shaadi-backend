


import express from "express";
import User from "../models/User.js";

const router = express.Router();





router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { religion, community, maritalStatus, age, page = 1, limit = 10 } = req.query;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const filters = {};

    // ✅ Opposite gender filter
    if (currentUser.gender === "Male") filters.gender = "Female";
    else if (currentUser.gender === "Female") filters.gender = "Male";

    if (religion) filters.religion = religion;
    if (community) filters.community = community;
    if (maritalStatus) filters.maritalStatus = maritalStatus;

    // ✅ Filter by exact age if provided
    if (age) filters.age = Number(age);

    // ✅ Exclude yourself
    filters._id = { $ne: userId };

    // ✅ Exclude users already in sentRequests, receivedRequests, or acceptedRequests
    const excludeIds = [
      ...currentUser.sentRequests,
      ...currentUser.receivedRequests,
      ...currentUser.acceptedRequests,
    ];

    if (excludeIds.length > 0) {
      filters._id = { $nin: [...excludeIds, userId] };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filters);
    const matches = await User.find(filters)
      .skip(skip)
      .limit(+limit)
      .select("name gender age religion community profession location image");

    res.json({
      success: true,
      matches,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔹 Send Request
 */
/**
 * 🔹 Connect (alias for Send Request)
 */
router.post("/connect", async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ success: false, message: "Both from and to are required" });
    }

    if (from === to) {
      return res.status(400).json({ success: false, message: "Cannot send request to yourself" });
    }

    await User.findByIdAndUpdate(from, { $addToSet: { sentRequests: to } });
    await User.findByIdAndUpdate(to, { $addToSet: { receivedRequests: from } });

    res.json({ success: true, message: "Connection request sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/send/:fromId/:toId", async (req, res) => {
  try {
    const { fromId, toId } = req.params;

    if (fromId === toId) {
      return res.status(400).json({ success: false, message: "Cannot send request to yourself" });
    }

    await User.findByIdAndUpdate(fromId, { $addToSet: { sentRequests: toId } });
    await User.findByIdAndUpdate(toId, { $addToSet: { receivedRequests: fromId } });

    res.json({ success: true, message: "Request sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔹 Accept Request
 */
router.post("/accept", async (req, res) => {
  try {
    const { userId, fromId } = req.body;

    await User.findByIdAndUpdate(userId, {
      $pull: { receivedRequests: fromId },
      $addToSet: { acceptedRequests: fromId },
    });

    await User.findByIdAndUpdate(fromId, {
      $pull: { sentRequests: userId },
      $addToSet: { acceptedRequests: userId },
    });

    res.json({ success: true, message: "Request accepted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔹 Get Received Requests
 */
router.get("/received/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "receivedRequests",
      "name gender age religion community profession location image"
    );
    res.json({ success: true, received: user.receivedRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔹 Get Sent Requests
 */
router.get("/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "sentRequests",
      "name gender age religion community profession location image"
    );
    res.json({ success: true, sent: user.sentRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔹 Get Accepted Requests
 */
router.get("/accepted/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "acceptedRequests",
      "name gender age religion community profession location image"
    );
    res.json({ success: true, accepted: user.acceptedRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


/**
 * 🔹 Decline Request (Remove from receivedRequests)
 */
router.post("/decline", async (req, res) => {
  try {
    const { userId, fromId } = req.body;

    if (!userId || !fromId) {
      return res.status(400).json({ success: false, message: "userId and fromId are required" });
    }

    // Remove from current user's receivedRequests
    await User.findByIdAndUpdate(userId, {
      $pull: { receivedRequests: fromId },
    });

    // Also remove from sender's sentRequests
    await User.findByIdAndUpdate(fromId, {
      $pull: { sentRequests: userId },
    });

    res.json({ success: true, message: "Request declined" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔹 Cancel Sent Request (Remove from sentRequests)
 */
router.post("/cancel", async (req, res) => {
  try {
    const { userId, toId } = req.body;

    if (!userId || !toId) {
      return res.status(400).json({ success: false, message: "userId and toId are required" });
    }

    // Remove from current user's sentRequests
    await User.findByIdAndUpdate(userId, {
      $pull: { sentRequests: toId },
    });

    // Also remove from receiver's receivedRequests
    await User.findByIdAndUpdate(toId, {
      $pull: { receivedRequests: userId },
    });

    res.json({ success: true, message: "Request canceled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;
