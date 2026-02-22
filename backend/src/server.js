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

import express from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

// ================= MIDDLEWARE =================

// JSON parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "https://talent-iq-one-sigma.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  }),
);

// Clerk auth
app.use(clerkMiddleware());

// ================= PERFORMANCE LOGGER =================
// Logs method, route, status code, and response time
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`,
    );
  });

  next();
});

// ================= ROUTES =================

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Talent-IQ Backend API is running",
  });
});

// Improved health route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ================= SERVER START =================

const PORT = ENV.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

startServer();
