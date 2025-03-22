import { useState } from "react";
import cookie from "cookie";
import { useNavigate } from "react-router";

const keyframeStyles = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const styles = {
  container: {
    position: "relative",
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    overflow: "hidden",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "150%",
    height: "150%",
    background: "linear-gradient(270deg, #ff0080, #00ccff, #ff0080)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 8s ease infinite",
    zIndex: -1,
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "25px",
    background: "linear-gradient(90deg, #ff0080, #00ccff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    animation: "pulse 2s infinite",
  },
  form: {
    width: "100%",
    zIndex: 1,
  },
  label: {
    fontWeight: "600",
    marginBottom: "8px",
    color: "#fff",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "20px",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  chatWindow: {
    width: "100%",
    height: "300px",
    overflowY: "auto",
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.3)",
    marginBottom: "20px",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  },
  message: {
    background: "rgba(0, 0, 0, 0.4)",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1rem",
    animation: "fadeIn 0.5s ease forwards",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  addInput: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    marginRight: "10px",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  button: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#ff0080",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.3s ease, transform 0.3s ease",
  },
  deleteButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "background 0.3s ease, transform 0.3s ease",
  },
};

export const NewSession = () => {
  const [sessionTitle, setSessionTitle] = useState("");
  const [reflections, setReflections] = useState([]);
  const [currentReflection, setCurrentReflection] = useState("");
  const navigate = useNavigate();

  function addReflection() {
    if (currentReflection && !reflections.includes(currentReflection)) {
      setReflections([...reflections, currentReflection]);
    }
    setCurrentReflection("");
  }

  function removeReflection(reflection) {
    setReflections(reflections.filter(r => r !== reflection));
  }

  async function saveSession(e) {
    e.preventDefault();
    const { csrftoken } = cookie.parse(document.cookie);
    const response = await fetch("/session_lists/", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFTOKEN": csrftoken,
      },
      body: JSON.stringify({
        name: sessionTitle,
        items: reflections,
      }),
    });
    const data = await response.json();
    if (data.success) {
      // Navigate to the reflection sessions list page
      navigate("/view_session_lists");
    } else {
      // Handle error as needed
      console.error("Error saving session");
    }
  }

  return (
    <div style={styles.container}>
      <style>{keyframeStyles}</style>
      <div style={styles.backgroundOverlay}></div>
      <div style={styles.header}>New Reflection Session</div>
      <form onSubmit={saveSession} style={styles.form}>
        <div style={{ marginBottom: "20px" }}>
          <label style={styles.label}>Session Title</label>
          <input
            style={styles.input}
            value={sessionTitle}
            onChange={e => setSessionTitle(e.target.value)}
            placeholder="e.g., Morning Reflection"
          />
        </div>

        <div style={styles.chatWindow}>
          {reflections.map((reflection, index) => (
            <div key={index} style={styles.message}>
              <span>{reflection}</span>
              <button
                type="button"
                onClick={() => removeReflection(reflection)}
                style={styles.deleteButton}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <input
            style={styles.addInput}
            value={currentReflection}
            onChange={e => setCurrentReflection(e.target.value)}
            placeholder="Write down your thoughts or feelings..."
          />
          <button
            type="button"
            onClick={addReflection}
            style={styles.button}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            +Add
          </button>
        </div>

        <button
          type="submit"
          style={{ ...styles.button, width: "100%" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          Save Session
        </button>
      </form>
    </div>
  );
};
