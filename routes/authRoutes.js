

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import Mailjet from "node-mailjet";

const router = express.Router();

/**
 * SIGNUP
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, gender, religion, community, age } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists with this email or phone" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      gender,
      religion,
      community,
      age: Number(age) || 0,
    
    });

    await user.save();
    res.status(201).json({ msg: "Signup successful", userId: user._id });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        religion: user.religion,
        community: user.community,
        age: user.age,
        height: user.height,
        location: user.location,
        image: user.image,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * FORGOT PASSWORD (Using Mailjet)
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Mailjet setup
    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    // const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    const resetUrl = `${frontendUrl}?token=${resetToken}`;

    // Send email
    const request = mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: { Email: process.env.MJ_SENDER_EMAIL, Name: "Default" },
            To: [{ Email: user.email, Name: user.name }],
            Subject: "Password Reset Request",
            HTMLPart: `
              <p>Hello ${user.name},</p>
              <p>You requested a password reset. Click the link below to reset your password:</p>
              <a href="${resetUrl}">${resetUrl}</a>
              <p>This link will expire in 1 hour.</p>
            `,
          },
        ],
      });

    await request;
    console.log("Mail sent to:", user.email);

    res.json({ msg: "Password reset link sent to email", resetToken });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * RESET PASSWORD
 */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
