import mongoose from "mongoose";
import User from "./models/User.js"; // add .js for ESM

mongoose.connect("mongodb+srv://RajeswariPaila:G9aA6lT0gSaK0U14@cluster0.hc7zc.mongodb.net/shaadi-backend?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
    console.log("Connected to MongoDB");

    // Optional: clear existing users
    await User.deleteMany({});

    const users = [];
    for (let i = 1; i <= 100; i++) {
      users.push({
        name: `User ${i}`,
        dob: 20 + (i % 30),
        height: 150 + (i % 50),
        maritalStatus: ["Never Married", "Divorced", "Widowed"][i % 3],
        religion: ["Hindu", "Muslim", "Christian"][i % 3],
        community: ["Brahmin", "Rajput", "Kayastha"][i % 3],
        motherTongue: ["Hindi", "Telugu", "Tamil"][i % 3],
        manglik: ["Yes", "No", "Doesn't Matter"][i % 3],
        countryLiving: ["India", "USA", "UK"][i % 3],
        stateLiving: ["Delhi", "Maharashtra", "Telangana"][i % 3],
        countryGrewUp: ["India", "USA", "UK"][i % 3],
        residencyStatus: ["Citizen", "Permanent Resident", "Work Permit"][i % 3],
        photoSettings: ["Visible to All", "Visible to Matches Only", "Private"][i % 3],
        profession: ["Engineer", "Doctor", "Teacher"][i % 3],
        location: ["Delhi", "Mumbai", "Chennai"][i % 3],
        image: "https://randomuser.me/api/portraits/women/44.jpg",
      });
    }

    await User.insertMany(users);
    console.log("Dummy users inserted");
    process.exit();
  })
  .catch((err) => console.log(err));
