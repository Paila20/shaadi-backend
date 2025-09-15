


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    
    // ✅ Instead of dob, store numeric age
    age: { type: Number, min: 18, max: 100 }, // easier to filter using range

    religion: { type: String },
    community: { type: String },
    motherTongue: { type: String },
    maritalStatus: { type: String, enum: ["Never Married", "Divorced", "Widowed", "Separated"] },
    image: { type: String },
    manglik: { type: String, enum: ["Yes", "No", "Doesn't Matter"] },

    // ✅ Store height in cm (numeric)
    height: { type: Number, min: 100, max: 250 },

    profession: { type: String },
    location: { type: String },
    countryLiving: { type: String },
    stateLiving: { type: String },
    countryGrewUp: { type: String },
    residencyStatus: { type: String, enum: ["Citizen", "Permanent Resident", "Work Permit", "Student Visa"] },
    photoSettings: { type: String, enum: ["Visible to All", "Visible to Matches Only", "Private"] },

    // ✅ Connection system
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    acceptedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
