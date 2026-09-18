import express from "express";
import fetch from "node-fetch";
import { ENV } from "../config/env.js";

const router = express.Router();

// JDoodle credentials
const CLIENT_ID = ENV.JDOODLE_CLIENT_ID;
const CLIENT_SECRET = ENV.JDOODLE_CLIENT_SECRET;

// Map frontend languages to JDoodle language & versionIndex
const JDoodleLangMap = {
  javascript: { language: "nodejs", versionIndex: "6" },
  python: { language: "python3", versionIndex: "4" },
  java: { language: "java", versionIndex: "6" },
  cpp: { language: "cpp17", versionIndex: "2" },
};

//Route 
router.post("/", async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code)
      return res.status(400).json({ error: "Language and code required to proceed" });

    if (!JDoodleLangMap[language])
      return res.status(400).json({ error: "Unsupported language" });

    const { language: jdLang, versionIndex } = JDoodleLangMap[language];

    const body = {
      script: code,
      language: jdLang,
      versionIndex: String(versionIndex),
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    };

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error, output: data.output || "" });
    }

    res.status(200).json({
      success: true,
      output: data.output || "No output",
    });

  } catch (error) {
    res.status(500).json({ error: "Code execution failed", details: error.message });
  }
});

export default router;