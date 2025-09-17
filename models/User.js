



// import mongoose from "mongoose";

// const partnerPreferenceSchema = new mongoose.Schema({
//   ageRange: {
//     min: { type: Number, min: 18, max: 100 },
//     max: { type: Number, min: 18, max: 100 },
//   }, 
//   heightRange: {
//     min: { type: Number, min: 100, max: 250 },
//     max: { type: Number, min: 100, max: 250 },
//   },
//   religion: [String],
//   community: [String],
//   motherTongue: [String],
//   maritalStatus: {
//     type: [String],
//     enum: ["Never Married", "Divorced", "Widowed", "Separated"],
//   },
//   location: {
//     country: [String],
//     state: [String],
//     city: [String],
//   },
//   education: [String],
//   profession: [String],
//   annualIncomeRange: {
//     min: { type: Number, default: 0 },
//     max: { type: Number, default: 0 },
//   },
//   diet: { type: [String] }, // Veg / Non-Veg / Vegan etc.
//   profileManagedBy: { type: [String] },
//   hobbies: [String],
// });

// const userSchema = new mongoose.Schema(
//   {
//     // 🔑 Basic Details
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     phone: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     gender: { type: String, enum: ["Male", "Female"], required: true },
//     age: { type: Number, min: 18, max: 100 },
//     dob: { type: Date }, // optional if you want exact date
//     height: { type: Number, min: 100, max: 250 }, // in cm
//     maritalStatus: { type: String, enum: ["Never Married", "Awaiting Divorce", "Divorced", "Widowed", "Separated"] },
//     noOfChildren: { type: Number, default: 0 },
//     childrenLivingWith: { type: Boolean },

//     // 🔑 Lifestyle & Health
//     diet: { type: String, enum: ["Veg", "Non-Veg", "Vegan", "Eggetarian", "Other"] },
//     bloodGroup: { type: String },
//     healthInfo: { type: String }, // e.g., "Diabetes"
//     disability: { type: String },

//     // 🔑 Religious Info
//     religion: { type: String },
//     community: { type: String },
//     subCommunity: { type: String },
//     gothra: { type: String },
//     motherTongue: { type: String },
//     manglik: { type: String, enum: ["Yes", "No", "Don't Know", "Doesn't Matter"] },

//     // 🔑 Family Info
//     familyLocation: { type: String },
//     fatherStatus: { type: String },
//     motherStatus: { type: String },
//     noOfSisters: { type: Number, default: 0 },
//     noOfBrothers: { type: Number, default: 0 },
//     familyFinancialStatus: { type: String },

//     // 🔑 Education & Career
//     highestQualification: { type: String },
//     college: { type: String },
//     workingWith: { type: String },
//     workingAs: { type: String },
//     employerName: { type: String },
//     annualIncome: { type: Number },

//     // 🔑 Location
//     currentResidence: { type: String },
//     stateLiving: { type: String },
//     countryLiving: { type: String },
//     residencyStatus: { type: String, enum: ["Citizen", "Permanent Resident", "Work Permit", "Student Visa"] },

//     // 🔑 Hobbies (optional)
//     hobbies: [String],
//     interests: [String],

//     // 🔑 Photo & Privacy Settings
//     image: { type: String },
//     photoSettings: { type: String, enum: ["Visible to All", "Visible to Matches Only", "Private"] },

//     // 🔑 Partner Preferences
//     partnerPreferences: partnerPreferenceSchema,

//     // 🔑 Matchmaking Connection System
//     sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     acceptedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//     // 🔑 Security
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const partnerPreferenceSchema = new mongoose.Schema({
  ageRange: {
    min: { type: Number, min: 18, max: 100 },
    max: { type: Number, min: 18, max: 100 },
  },
  heightRange: {
    min: { type: Number, min: 100, max: 250 },
    max: { type: Number, min: 100, max: 250 },
  },
  religion: [{ type: String }],
  community: [{ type: String }],
  motherTongue: [{ type: String }],
  maritalStatus: {
    type: [String],
    enum: ["Never Married", "Divorced", "Widowed", "Separated"],
  },
  location: {
    country: [{ type: String }],
    state: [{ type: String }],
    city: [{ type: String }],
  },
  education: {
    type: [String],
    enum: ["High School", "Diploma", "B.Tech", "M.Tech", "MBA", "B.Sc", "M.Sc", "PhD", "Other"],
  },
  profession: {
    type: [String],
    enum: [
      "Software Engineer",
      "Doctor",
      "Teacher",
      "Business",
      "Lawyer",
      "Government Service",
      "Freelancer",
      "Other",
    ],
  },
  annualIncomeRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  diet: {
    type: [String],
    enum: ["Veg", "Non-Veg", "Vegan", "Eggetarian", "Other"],
  },
  profileManagedBy: {
    type: [String],
    enum: ["Self", "Parents", "Sibling", "Friend", "Other"],
  },
  hobbies: {
    type: [String],
    enum: [
      "Reading",
      "Traveling",
      "Cooking",
      "Sports",
      "Music",
      "Movies",
      "Photography",
      "Dancing",
      "Gaming",
      "Other",
    ],
  },
});

const userSchema = new mongoose.Schema(
  {
    // 🔑 Basic Details
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    age: { type: Number, min: 18, max: 100 },
    dob: { type: Date },
    height: { type: Number, min: 100, max: 250 },
    maritalStatus: {
      type: String,
      enum: ["Never Married", "Awaiting Divorce", "Divorced", "Widowed", "Separated"],
    },
    noOfChildren: { type: Number, default: 0 },
    childrenLivingWith: { type: Boolean },

    // 🔑 Lifestyle & Health
    diet: { type: String, enum: ["Veg", "Non-Veg", "Vegan", "Eggetarian", "Other"] },
    bloodGroup: { type: String },
    healthInfo: { type: String },
    disability: { type: String },

    // 🔑 Religious Info
    religion: { type: String },
    community: { type: String },
    subCommunity: { type: String },
    gothra: { type: String },
    motherTongue: { type: String },
    manglik: { type: String, enum: ["Yes", "No", "Don't Know", "Doesn't Matter"] },

    // 🔑 Family Info
    familyLocation: { type: String },
    fatherStatus: { type: String },
    motherStatus: { type: String },
    noOfSisters: { type: Number, default: 0 },
    noOfBrothers: { type: Number, default: 0 },
    familyFinancialStatus: { type: String },

    // 🔑 Education & Career
    highestQualification: {
      type: String,
      enum: ["High School", "Diploma", "B.Tech", "M.Tech", "MBA", "B.Sc", "M.Sc", "PhD", "Other"],
    },
    college: { type: String },
    workingWith: { type: String },
    workingAs: {
      type: String,
      enum: [
        "Software Engineer",
        "Doctor",
        "Teacher",
        "Business",
        "Lawyer",
        "Government Service",
        "Freelancer",
        "Other",
      ],
    },
    employerName: { type: String },
    annualIncome: { type: Number },

    // 🔑 Location
    currentResidence: { type: String },
    stateLiving: { type: String },
    countryLiving: { type: String },
    residencyStatus: {
      type: String,
      enum: ["Citizen", "Permanent Resident", "Work Permit", "Student Visa"],
    },

    // 🔑 Hobbies & Interests
    hobbies: {
      type: [String],
      enum: [
        "Reading",
        "Traveling",
        "Cooking",
        "Sports",
        "Music",
        "Movies",
        "Photography",
        "Dancing",
        "Gaming",
        "Other",
      ],
    },
    interests: [String],

    // 🔑 Photo & Privacy Settings
    image: { type: String },
    photoSettings: {
      type: String,
      enum: ["Visible to All", "Visible to Matches Only", "Private"],
    },

    // 🔑 Partner Preferences
    partnerPreferences: partnerPreferenceSchema,

    // 🔑 Matchmaking Connection System
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    acceptedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 🔑 Security
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
