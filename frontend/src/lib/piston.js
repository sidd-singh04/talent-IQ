const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
};

/**
//  * @param {string} language - programming language
//  * @param {string} code - source code to executed
//  * @returns {Promise<{success:boolean, output?:string, error?: string}>}
//  */

export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return { success: false, error: `Unsupported language: ${language}` };
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: getFileName(language),
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP error ${response.status}` };
    }

    const data = await response.json();

    const compileError = data.compile?.stderr || "";
    const runtimeError = data.run?.stderr || "";
    const output = data.run?.output || "";

    if (compileError) {
      return { success: false, error: compileError };
    }

    if (runtimeError) {
      return { success: false, output, error: runtimeError };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
  };

  return extensions[language] || "txt";
}

function getFileName(language) {
  if (language === "java") return "Main.java";
  return `main.${getFileExtension(language)}`;
}
