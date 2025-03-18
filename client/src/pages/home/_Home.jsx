import React, { useState } from "react"
import { Link } from "react-router-dom"

export const Home = () => {
  const [userMessage, setUserMessage] = useState("")
  const [botResponse, setBotResponse] = useState("")

  const handleSend = () => {
    // For now, just log the user message and set a placeholder response
    console.log("User message:", userMessage)
    setBotResponse("Hello world!")
    // Reset the input
    setUserMessage("")
  }

  return (
    <div>
      <Link to="/grocery_list/new">Create new list</Link>
      <div>I am on the home page, build me later!</div>

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
        
        {/* Display the bot's response if available */}
        {botResponse && (
          <div style={{ marginTop: "10px" }}>
            <strong>AI Response:</strong> {botResponse}
          </div>
        )}
      </div>
    </div>
  )
}
