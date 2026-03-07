export async function executeCode(language, code) {
  // Mapping frontend language keys to JDoodle expected keys
  const languageMap = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
  };

  if (!languageMap[language]) {
    return { success: false, error: "Unsupported language" };
  }

  try {
    const response = await fetch("https://talent-iq-one-sigma.vercel.app/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: languageMap[language], // must match JDoodleLangMap keys
        code: code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Execution failed" };
    }

    if (data.error) {
      return { success: false, error: data.error, output: data.output || "" };
    }

    return { success: true, output: data.output || "No output" };

  } catch (error) {
    return { success: false, error: `Failed to execute code: ${error.message}` };
  }
}