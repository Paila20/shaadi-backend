

// import express from "express";
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
// import User from "../models/User.js";

// const router = express.Router();

// // 🔹 Cloudinary Config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // 🔹 Multer Storage for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "profiles", // Folder name in Cloudinary
//     allowed_formats: ["jpg", "jpeg", "png"],
//   },
// });

// const upload = multer({ storage });

// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });

// /**
//  * ✅ Update User Profile (with image upload)
//  * PUT /api/users/:id
//  */
// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Collect all updates
//     let updateData = { ...req.body };

//     // If image uploaded → add Cloudinary URL
//     if (req.file?.path) {
//       updateData.image = req.file.path;
//     }

//     // Parse JSON strings (because frontend sends arrays/objects as stringified JSON)
//     Object.keys(updateData).forEach((key) => {
//       try {
//         updateData[key] = JSON.parse(updateData[key]);
//       } catch (err) {
//         // ignore non-JSON values
//       }
//     });

//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (error) {
//     console.error("❌ Update error:", error);
//     res.status(500).json({ msg: "Server error", error });
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

/**
 * ✅ Update User Profile (with image upload)
 * PUT /api/users/:id
 */
// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Collect update data
//     let updateData = { ...req.body };

//     // ✅ Save only Cloudinary URL, not the whole object
//     if (req.file) {
//       updateData.image =
//         req.file.path || req.file.secure_url || req.file.url;
//     }

//     // ✅ Parse JSON fields if frontend sends them as strings
//     Object.keys(updateData).forEach((key) => {
//       try {
//         updateData[key] = JSON.parse(updateData[key]);
//       } catch (err) {
//         // leave as string if not JSON
//       }
//     });

//     // ✅ Update user
//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (error) {
//     console.error("❌ Update error:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// });



router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    // Start with request body
    let updateData = { ...req.body };

    // ✅ If Cloudinary uploaded file → save only `secure_url`
    if (req.file && req.file.path) {
      updateData.image = req.file.path; // Multer gives URL here
    } else if (req.file && req.file.secure_url) {
      updateData.image = req.file.secure_url; // Cloudinary response
    }

    // ✅ Prevent saving "[object Object]" by forcing string
    if (updateData.image && typeof updateData.image !== "string") {
      updateData.image = String(updateData.image);
    }

    // Parse JSON safely (for arrays/objects sent as strings)
    Object.keys(updateData).forEach((key) => {
      try {
        updateData[key] = JSON.parse(updateData[key]);
      } catch {
        // ignore if not JSON
      }
    });

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
