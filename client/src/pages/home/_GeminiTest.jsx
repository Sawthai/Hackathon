// GeminiTest.js
import React, { useState } from "react";

export const GeminiTest = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testGeminiAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/chat/");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unknown error occurred");
      } else {
        setResponseData(data);
      }
    } catch (err) {
      setError("An error occurred: " + err.toString());
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Test Gemini API</h1>
      <button onClick={testGeminiAPI}>Test API Key</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {responseData && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
