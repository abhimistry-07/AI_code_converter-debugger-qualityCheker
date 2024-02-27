import React, { useState } from "react";

function MainFile() {
  const [code, setCode] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");

  const handleConvert = async () => {
    try {
      const response = await fetch(
        // "http://localhost:8080/convert",
        "https://code-converter-9dtv.onrender.com/convert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, language }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setConvertedCode(data.convertedCode);
      setError(""); // Clear any previous error
    } catch (error) {
      console.error("Error converting code:", error);
      setError(
        "An error occurred while converting the code. Please try again later."
      );
      setConvertedCode(""); // Clear any previous converted code
    }
  };

  const handleDebug = async () => {
    try {
      const response = await fetch(
        "https://code-converter-9dtv.onrender.com/debug",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();
      setConvertedCode(data.debugedCode);
    } catch (error) {
      console.error("Error converting code:", error);
    }
  };

  const handleQuality = async () => {
    try {
      const response = await fetch(
        "https://code-converter-9dtv.onrender.com/quality",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();
      setConvertedCode(data.codeQuality);
    } catch (error) {
      console.error("Error converting code:", error);
    }
  };

  const handleClean = () => {
    setCode("");
    setConvertedCode("");
  };

  return (
    <div>
      <h1>Code Converter</h1>
      <div className="container">
        <div className="left-section">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code..."
          />
        </div>
        <div className="right-section">
          <pre style={{ color: "black" }}>{convertedCode}</pre>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      </div>
      <div id="buttonSection">
        <select
          className="selectTag"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Select Language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <button onClick={handleConvert}>CONVERT</button>
        <button onClick={handleDebug}>DEBUG</button>
        <button onClick={handleQuality}>QUALITY CHECK</button>
        <button onClick={handleClean}>CLEAN</button>
      </div>
    </div>
  );
}

export default MainFile;
