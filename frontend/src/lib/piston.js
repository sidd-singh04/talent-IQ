// export async function executeCode(language, code) {
//   // Mapping frontend language keys to JDoodle expected keys
//   const languageMap = {
//     javascript: "javascript",
//     python: "python",
//     java: "java",
//     cpp: "cpp",
//   };

//   if (!languageMap[language]) {
//     return { success: false, error: "Unsupported language" };
//   }

//   try {
//     const response = await fetch("http://localhost:3000/api/execute", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         language: languageMap[language], // must match JDoodleLangMap keys
//         code: code,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return { success: false, error: data.error || "Execution failed" };
//     }

//     if (data.error) {
//       return { success: false, error: data.error, output: data.output || "" };
//     }

//     return { success: true, output: data.output || "No output" };

//   } catch (error) {
//     return { success: false, error: `Failed to execute code: ${error.message}` };
//   }
// }




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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/execute`, {
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