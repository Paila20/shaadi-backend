


import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * 🔹 Get Matches (opposite gender + filters)
 * GET /api/matches/:userId
 */
// router.get("/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { religion, community, maritalStatus, ageMin, ageMax, page = 1, limit = 10 } = req.query;

//     // 1️⃣ Find logged-in user
//     const currentUser = await User.findById(userId);
//     if (!currentUser) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // 2️⃣ Build filters
//     const filters = {};

//     // opposite gender
//     if (currentUser.gender === "Male") filters.gender = "Female";
//     else if (currentUser.gender === "Female") filters.gender = "Male";

//     // other filters
//     if (religion) filters.religion = religion;
//     if (community) filters.community = community;
//     if (maritalStatus) filters.maritalStatus = maritalStatus;

//     if (ageMin || ageMax) {
//       filters.dob = {};
//       const today = new Date();
//       if (ageMin) {
//         const maxDob = new Date(today.setFullYear(today.getFullYear() - ageMin));
//         filters.dob.$lte = maxDob;
//       }
//       if (ageMax) {
//         const minDob = new Date(today.setFullYear(today.getFullYear() - ageMax));
//         filters.dob.$gte = minDob;
//       }
//     }

//     // exclude yourself from matches
//     filters._id = { $ne: userId };

//     // 3️⃣ Pagination
//     const skip = (page - 1) * limit;

//     // 4️⃣ Query
//     const total = await User.countDocuments(filters);
//     const matches = await User.find(filters)
//       .skip(skip)
//       .limit(+limit)
//       .select("name gender dob religion community profession location image"); // include image

//     res.json({
//       success: true,
//       matches,
//       total,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });



router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { religion, community, maritalStatus, ageMin, ageMax, page = 1, limit = 10 } = req.query;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Build filters
    const filters = {};

    // Opposite gender filter
    if (currentUser.gender === "Male") filters.gender = "Female";
    else if (currentUser.gender === "Female") filters.gender = "Male";

    if (religion) filters.religion = religion;
    if (community) filters.community = community;
    if (maritalStatus) filters.maritalStatus = maritalStatus;

    if (ageMin || ageMax) {
      filters.dob = {};
      const today = new Date();
      if (ageMin) {
        const maxDob = new Date(today.setFullYear(today.getFullYear() - ageMin));
        filters.dob.$lte = maxDob;
      }
      if (ageMax) {
        const minDob = new Date(today.setFullYear(today.getFullYear() - ageMax));
        filters.dob.$gte = minDob;
      }
    }

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
      .select("name gender dob religion community profession location image");

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
router.post("/accept/:userId/:fromId", async (req, res) => {
  try {
    const { userId, fromId } = req.params;

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
      "name gender dob religion community profession location image"
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
      "name gender dob religion community profession location image"
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
      "name gender dob religion community profession location image"
    );
    res.json({ success: true, accepted: user.acceptedRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
