


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

// /**
//  * ✅ Get User by ID
//  * GET /api/users/:id
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




// router.put("/:id", async (req, res) => {
//   try {
//     let updateData = { ...req.body };

//     // ✅ Convert age and height to numbers (if they exist)
//     if (req.body.age) {
//       updateData.age = Number(req.body.age);
//     }

//     if (req.body.height) {
//       updateData.height = Number(req.body.height);
//     }

//     // ✅ If image exists and is an object, store only its URL
//     if (updateData.image && typeof updateData.image === "object") {
//       updateData.image = updateData.image.secure_url || updateData.image.uri || "";
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//       runValidators: true, // ensures enums and validation are applied
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
    folder: "profiles", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

/**
 * ✅ Create User
 * POST /api/users
 */
// router.post("/", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     console.error("Error creating user:", err);
//     res.status(400).json({ msg: "Failed to create user", error: err.message });
//   }
// });

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
 * ✅ Update Entire Profile
 * PUT /api/users/:id
 */
router.put("/:id", async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (updateData.age) updateData.age = Number(updateData.age);
    if (updateData.height) updateData.height = Number(updateData.height);

    if (updateData.image && typeof updateData.image === "object") {
      updateData.image = updateData.image.secure_url || updateData.image.uri || "";
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * ✅ Partial Update (PATCH) for Profile
 * PATCH /api/users/:id
 */
router.patch("/:id", async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (updateData.age) updateData.age = Number(updateData.age);
    if (updateData.height) updateData.height = Number(updateData.height);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error patching user:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * ✅ Update Partner Preferences
 * PATCH /api/users/:id/preferences
 */
router.patch("/:id/preferences", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Merge new preferences into existing ones
    user.partnerPreferences = { ...user.partnerPreferences.toObject(), ...req.body };
    await user.save();

    res.json(user.partnerPreferences);
  } catch (err) {
    console.error("Error updating partner preferences:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * ✅ Upload Profile Photo
 * POST /api/users/:id/photo
 */
router.post("/:id/photo", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path }, // Cloudinary gives you secure URL in file.path
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ image: user.image });
  } catch (err) {
    console.error("Error uploading photo:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * ✅ Delete User
 * DELETE /api/users/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
