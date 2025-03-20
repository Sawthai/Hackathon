import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls

export const Home = () => {
  const [userMessage, setUserMessage] = useState("");
  //const [botResponse, setBotResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // store chat messages
  const chatContainerRef = useRef(null); // Ref for auto-scrolling
  

  const handleSend = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages
    
    const newUserMessage = { sender: "user", message: userMessage };
    setChatHistory((prev) => [...prev, newUserMessage]); // Add user message to history

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat/", {
        query: userMessage,
      });

      const newBotMessage = { sender: "bot", message: response.data.response };
      setChatHistory((prev) => [...prev, newBotMessage]); // Add bot response to history
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Error communicating with AI." },
      ]);
    }

    setUserMessage(""); // Clear input field
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  
  return (
    <div style={styles.container}>
      <h2>Talk To Ori</h2>
      
      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#007bff" : "#e0e0e0",
              color: msg.sender === "user" ? "#fff" : "#000",
            }}
          >
            {msg.message}
          </div>
        ))}
        <div ref={chatContainerRef} />
      </div>

      {/* Input Field */}
      <div style={styles.inputContainer}>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type a message..."
          rows={2}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

// Styles for the chat UI
const styles = {
  container: {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chatWindow: {
    width: "100%",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    margin: "5px",
    borderRadius: "15px",
    wordWrap: "break-word",
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "5px",
  },
  sendButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};