// src/pages/MeditationPage.jsx
import React, { useState } from 'react';

export const MeditationPage = () => {
  const [feeling, setFeeling] = useState('');
  const [meditationText, setMeditationText] = useState('');

  const handleStartMeditation = () => {
    // This is where the AI-generated meditation text will go.
    if (feeling.trim()) {
      setMeditationText(`Let's start with some calming breaths. Focus on your breathing and try to release any tension...`);
    } else {
      setMeditationText('Let me know how you feel today to start your personalized meditation.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Meditation Session</h2>
      <div style={styles.meditationContainer}>
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="How do you feel today?"
          rows={3}
          style={styles.input}
        />
        <button onClick={handleStartMeditation} style={styles.startButton}>
          Start Meditation
        </button>

        <div style={styles.meditationText}>
          {meditationText && <p>{meditationText}</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  meditationContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  startButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  meditationText: {
    marginTop: '20px',
    fontSize: '16px',
  },
};
