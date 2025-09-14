// import express from "express";
// import User from "../models/User.js";

// const router = express.Router();

// // POST /api/search
// router.post("/", async (req, res) => {
//   try {
//     const {
//       ageRange,
//       heightRange,
//       religion,
//       community,
//       maritalStatus,
//       motherTongue,
//       countryLiving,
//       stateLiving,
//       countryGrewUp,
//       residencyStatus,
//       photoSettings,
//       searchText,
//     } = req.body;

//     const query = {};

//     // Age range filter
//     if (ageRange?.length === 2) {
//       const minDob = new Date();
//       minDob.setFullYear(minDob.getFullYear() - ageRange[1]);
//       const maxDob = new Date();
//       maxDob.setFullYear(maxDob.getFullYear() - ageRange[0]);
//       query.dob = { $gte: minDob, $lte: maxDob };
//     }

//     // Height filter
//     if (heightRange?.length === 2) {
//       query.height = { $gte: heightRange[0], $lte: heightRange[1] };
//     }

//     // Other filters
//     if (religion?.length) query.religion = { $in: religion };
//     if (community?.length) query.community = { $in: community };
//     if (maritalStatus?.length) query.maritalStatus = { $in: maritalStatus };
//     if (motherTongue?.length) query.motherTongue = { $in: motherTongue };
//     if (countryLiving?.length) query.countryLiving = { $in: countryLiving };
//     if (stateLiving?.length) query.stateLiving = { $in: stateLiving };
//     if (countryGrewUp?.length) query.countryGrewUp = { $in: countryGrewUp };
//     if (residencyStatus?.length) query.residencyStatus = { $in: residencyStatus };
//     if (photoSettings?.length) query.photoSettings = { $in: photoSettings };

//     // Text search
//     if (searchText?.trim()) {
//       const regex = new RegExp(searchText.trim(), "i");
//       query.$or = [
//         { name: regex },
//         { profession: regex },
//         { _id: regex }, // profile ID
//       ];
//     }

//     const users = await User.find(query).select("-password -__v");

//     res.json({ success: true, users });
//   } catch (err) {
//     console.error("Search error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;



import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/search
router.post("/", async (req, res) => {
  try {
    const {
      ageRange,
      heightRange,
      religion,
      community,
      maritalStatus,
      motherTongue,
      countryLiving,
      stateLiving,
      countryGrewUp,
      residencyStatus,
      photoSettings,
      searchText,
      gender, // ✅ get gender from frontend
    } = req.body;

    const query = {};

    // Gender filter
    if (gender) {
      query.gender = gender;
    }

    // Age range filter
    if (ageRange?.length === 2) {
      const minDob = new Date();
      minDob.setFullYear(minDob.getFullYear() - ageRange[1]);
      const maxDob = new Date();
      maxDob.setFullYear(maxDob.getFullYear() - ageRange[0]);
      query.dob = { $gte: minDob, $lte: maxDob };
    }

    // Height filter
    if (heightRange?.length === 2) {
      query.height = { $gte: heightRange[0], $lte: heightRange[1] };
    }

    // Other filters
    if (religion?.length) query.religion = { $in: religion };
    if (community?.length) query.community = { $in: community };
    if (maritalStatus?.length) query.maritalStatus = { $in: maritalStatus };
    if (motherTongue?.length) query.motherTongue = { $in: motherTongue };
    if (countryLiving?.length) query.countryLiving = { $in: countryLiving };
    if (stateLiving?.length) query.stateLiving = { $in: stateLiving };
    if (countryGrewUp?.length) query.countryGrewUp = { $in: countryGrewUp };
    if (residencyStatus?.length) query.residencyStatus = { $in: residencyStatus };
    if (photoSettings?.length) query.photoSettings = { $in: photoSettings };

    // Text search
    if (searchText?.trim()) {
      const regex = new RegExp(searchText.trim(), "i");
      query.$or = [
        { name: regex },
        { profession: regex },
        { _id: regex }, // profile ID
      ];
    }

    const users = await User.find(query).select("-password -__v");

    res.json({ success: true, users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
