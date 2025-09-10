
// import express from "express";
// import User from "../models/User.js";
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";

// // 🔹 Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const router = express.Router();

// // 🔹 Setup multer storage for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "shaadi_users", // Folder name in Cloudinary
//     allowed_formats: ["jpg", "jpeg", "png"],
//     transformation: [{ width: 400, height: 400, crop: "fill" }], // resize/crop
//   },
// });

// const upload = multer({ storage });

// /**
//  * @route   GET /api/users/:id
//  * @desc    Get user by ID
//  */
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });


// // Update user route
// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     let updates = req.body;

//     // If image uploaded, Multer + Cloudinary gives URL in req.file.path
//     if (req.file && req.file.path) {
//       updates.image = req.file.path;
//     }

//     // Convert stringified arrays/objects back to JS objects
//     Object.keys(updates).forEach((key) => {
//       if (typeof updates[key] === "string" && updates[key].startsWith("[") && updates[key].endsWith("]")) {
//         try {
//           updates[key] = JSON.parse(updates[key]);
//         } catch {}
//       }
//     });

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

//     if (!updatedUser) return res.status(404).json({ msg: "User not found" });

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });

// export default router;


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

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * ✅ Update User Profile (with image upload)
 * PUT /api/users/:id
 */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    // Collect all updates
    let updateData = { ...req.body };

    // If image uploaded → add Cloudinary URL
    if (req.file?.path) {
      updateData.image = req.file.path;
    }

    // Parse JSON strings (because frontend sends arrays/objects as stringified JSON)
    Object.keys(updateData).forEach((key) => {
      try {
        updateData[key] = JSON.parse(updateData[key]);
      } catch (err) {
        // ignore non-JSON values
      }
    });

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

export default router;
