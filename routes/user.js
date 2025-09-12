


import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profiles", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

/**
 * ✅ Get User by ID
 * GET /api/users/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


// router.put("/:id", async (req, res) => {
//   try {
//     let updateData = { ...req.body };

//     // ✅ Ensure ageRange and heightRange are stored as objects
//     if (req.body.ageRange) {
//       updateData.ageRange = {
//         min: Number(req.body.ageRange.min) || 0,
//         max: Number(req.body.ageRange.max) || 0,
//       };
//     }

//     if (req.body.heightRange) {
//       updateData.heightRange = {
//         min: Number(req.body.heightRange.min) || 0,
//         max: Number(req.body.heightRange.max) || 0,
//       };
//     }

//     // ✅ If image exists and is an object, store only its URL
//     if (updateData.image && typeof updateData.image === "object") {
//       updateData.image = updateData.image.secure_url || updateData.image.uri || "";
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//       runValidators: true, // ✅ ensures enums are respected
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });


router.put("/:id", async (req, res) => {
  try {
    let updateData = { ...req.body };

    // ✅ Convert age and height to numbers (if they exist)
    if (req.body.age) {
      updateData.age = Number(req.body.age);
    }

    if (req.body.height) {
      updateData.height = Number(req.body.height);
    }

    // ✅ If image exists and is an object, store only its URL
    if (updateData.image && typeof updateData.image === "object") {
      updateData.image = updateData.image.secure_url || updateData.image.uri || "";
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true, // ensures enums and validation are applied
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
