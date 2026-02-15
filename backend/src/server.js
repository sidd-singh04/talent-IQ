// import express from "express";
// import cors from "cors";
// import { ENV } from "./lib/env.js";
// import { connectDB } from "./lib/db.js";
// import {serve} from "inngest/express";
// import { inngest, functions } from "./lib/inngest.js";
// import { clerkMiddleware } from "@clerk/express";
// import chatRoutes from "./routes/chatRoutes.js"
// import sessionRoutes from "./routes/sessionRoute.js"

// const app = express();

// // middleware
// app.use(express.json());

// app.use(
//   cors({
//     origin: [
//       "https://talent-iq-one-sigma.vercel.app",
//       "http://localhost:5173",
//       "http://localhost:5174",
//     ],
//     credentials: true,
//   }),
// );

// app.use(clerkMiddleware());


// app.use("/api/inngest", serve({ client: inngest, functions }));
// app.use("/api/chat", chatRoutes);
// app.use("/api/sessions", sessionRoutes);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Talent-IQ Backend API is running",
//   });
// });

// app.get("/health", (req, res) => {
//   req.auth;
//   res.status(200).json({ message: "API Running" });
// });


// // port
// const PORT = ENV.PORT || 5000;

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.log("Error", error);
//   }
// };
// startServer();




import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import User from "../models/User.js"; // ✅ Added (required for Clerk mapping)

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;

    const clerkId = req.auth.userId; // ✅ Changed
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId }); // ✅ Added
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id; // ✅ Changed

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await Session.create({ problem, difficulty, host: userId, callId });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const clerkId = req.auth.userId; // ✅ Changed
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId }); // ✅ Added
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id; // ✅ Changed

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    const clerkId = req.auth.userId; // ✅ Changed
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId }); // ✅ Added
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id; // ✅ Changed

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;

    const clerkId = req.auth.userId; // ✅ Changed
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId }); // ✅ Added
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id; // ✅ Changed

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
