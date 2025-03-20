import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls

export const Home = () => {
  const [userMessage, setUserMessage] = useState("");
  const [botResponse, setBotResponse] = useState("");

  const handleSend = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat/", {
        query: userMessage,
      });

      setBotResponse(response.data.response); // Update bot's response
    } catch (error) {
      console.error("Error sending message:", error);
      setBotResponse("Error communicating with AI.");
    }

    setUserMessage(""); // Clear input field after sending
  };

  return (
    <div>
      

      <div style={{ marginTop: "20px" }}>
        <h2>AI Chat Prototype</h2>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={3}
          cols={50}
        />
        <br />
        <button onClick={handleSend}>Send</button>

        {/* Display the bot's response */}
        {botResponse && (
          <div style={{ marginTop: "10px" }}>
            <strong>AI Response:</strong> {botResponse}
          </div>
        )}
      </div>
    </div>
  );
};