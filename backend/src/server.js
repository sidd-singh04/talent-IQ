import express from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";

const app = express();

app.use(express.json());

// ✅ allowed origins list
const allowedOrigins = [
  "https://talent-iq-one-sigma.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API Running" });
});

const PORT = ENV.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
