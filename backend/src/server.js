import express from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import {serve} from "inngest/express";
import { inngest } from "./lib/inngest.js";

const app = express();

// middleware
app.use(express.json());

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

app.use("/api/inngest", serve({ client: inngest, functions }));
// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "API Running" });
});

// port
const PORT = ENV.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error", error);
  }
};
startServer();