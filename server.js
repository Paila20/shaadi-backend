import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import matchesRoutes from "./routes/matches.js";
import userRoutes from "./routes/user.js";
import searchRouter from "./routes/search.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const app = express();

// Middleware
// app.use(cors());

app.use(cors({ origin: "https://fancy-lebkuchen-dd3e41.netlify.app/" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRouter);
app.use("/api/chat", chatRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error(err));
