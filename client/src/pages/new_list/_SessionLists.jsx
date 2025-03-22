import React, { useEffect, useState } from "react";
import cookie from "cookie";

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
  sessionTitle: {
    fontSize: "1.8rem",
    color: "#fff",
    marginBottom: "10px",
  },
  chatWindow: {
    width: "100%",
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
    alignItems: "center",
    fontSize: "1rem",
    animation: "fadeIn 0.5s ease forwards",
    color: "#fff",
  },
  deleteButton: {
    marginLeft: "auto",
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

export const SessionLists = () => {
  const [sessionLists, setSessionLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/view_session_lists/", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        setSessionLists(data.session_lists);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching session lists", err);
        setLoading(false);
      });
  }, []);

  const deleteSession = async (id) => {
    const { csrftoken } = cookie.parse(document.cookie);
    const response = await fetch(`/session_lists/${id}/delete/`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "X-CSRFTOKEN": csrftoken,
      },
    });
    const data = await response.json();
    if (data.success) {
      // Remove the deleted session from state.
      setSessionLists(sessionLists.filter((session) => session.id !== id));
    } else {
      console.error("Error deleting session:", data.error);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{keyframeStyles}</style>
        <div style={{ textAlign: "center", color: "#fff" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframeStyles}</style>
      <div style={styles.backgroundOverlay}></div>
      <div style={styles.header}>Your Reflection Sessions</div>
      {sessionLists.length === 0 ? (
        <div style={{ color: "#fff", textAlign: "center" }}>
          No sessions found.
        </div>
      ) : (
        sessionLists.map((session) => (
          <div key={session.id} style={{ marginBottom: "30px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2 style={styles.sessionTitle}>{session.name}</h2>
              <button
                style={styles.deleteButton}
                onClick={() => deleteSession(session.id)}
              >
                Delete
              </button>
            </div>
            {session.items.length > 0 && (
              <div style={styles.chatWindow}>
                {session.items.map((item) => (
                  <div key={item.id} style={styles.message}>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
