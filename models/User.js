

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     phone: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     gender: { type: String, enum: ["Male", "Female"], required: true },
//     dob: { type: Date },
//     religion: { type: String },
//     community: { type: String },
//     motherTongue: { type: String },
//     maritalStatus: { type: String, enum: ["Never Married", "Divorced", "Widowed", "Separated"] },
//     manglik: { type: String, enum: ["Yes", "No", "Doesn't Matter"] },
//     height: { type: Number }, // in cms
//     profession: { type: String },
//     location: { type: String },
//     countryLiving: { type: String },
//     stateLiving: { type: String },
//     countryGrewUp: { type: String },
//     residencyStatus: { type: String, enum: ["Citizen", "Permanent Resident", "Work Permit", "Student Visa"] },
//     photoSettings: { type: String, enum: ["Visible to All", "Visible to Matches Only", "Private"] },
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//   },
//   { timestamps: true } // auto manages createdAt & updatedAt
// );

// // Indexing for faster queries
// userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });
// userSchema.index({ gender: 1 });
// userSchema.index({ religion: 1 });
// userSchema.index({ community: 1 });
// userSchema.index({ maritalStatus: 1 });
// userSchema.index({ manglik: 1 });
// userSchema.index({ location: 1 });

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dob: { type: Date },
    religion: { type: String },
    community: { type: String },
    motherTongue: { type: String },
    maritalStatus: { type: String, enum: ["Never Married", "Divorced", "Widowed", "Separated"] },
     image: { type: String },
    manglik: { type: String, enum: ["Yes", "No", "Doesn't Matter"] },
    height: { type: Number }, // in cms
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
