import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// JDoodle credentials
const CLIENT_ID = "bb2a41340146533e813ef5c125ce81d0";
const CLIENT_SECRET = "94f95122e3238cabc0358101f6197209ddf909baaa536544bef6a184cfaea757";

// Mapping frontend language keys to JDoodle language & versionIndex
const JDoodleLangMap = {
  javascript: { language: "nodejs", versionIndex: "6" }, // Node.js latest supported
  python: { language: "python3", versionIndex: "4" },    // Python3 latest supported
  java: { language: "java", versionIndex: "6" },         // Java latest
  cpp: { language: "cpp17", versionIndex: "2" },         // C++17 latest
};

router.post("/", async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code)
      return res.status(400).json({ error: "Language and code required" });

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

    console.log("Sending to JDoodle:", body);

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("JDoodle response:", data);

    if (data.error) {
      return res.status(500).json({ error: data.error, output: data.output || "" });
    }

    res.status(200).json({
      output: data.output || "No output",
      success: true,
    });

  } catch (error) {
    console.log("Execution error:", error);
    res.status(500).json({ error: "Code execution failed", details: error.message });
  }
});

export default router;