import mongoose from "mongoose";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/yourdbname"; // change this

async function fixImages() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const users = await User.find({ image: "[object Object]" });
    console.log(`Found ${users.length} users with bad image`);

    for (let u of users) {
      u.image = null; // reset to null (frontend will use default)
      await u.save();
      console.log(`✅ Fixed user: ${u.name} (${u._id})`);
    }

    console.log("🎉 Done cleaning images");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing images:", err);
    process.exit(1);
  }
}

fixImages();
