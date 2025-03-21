import React, { useState, useEffect, useRef } from 'react';

export const MeditationPage = () => {
  const [feeling, setFeeling] = useState('');
  const [meditationText, setMeditationText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [selectedTimeInMinutes, setSelectedTimeInMinutes] = useState(5);
  const [playInLoop, setPlayInLoop] = useState(false);

  // Use ref for audio to prevent overlapping sounds
  const audioTune = useRef(new Audio('/static/sounds/beach.mp3'));

  useEffect(() => {
    audioTune.current.load();
  }, []);

  useEffect(() => {
    audioTune.current.loop = playInLoop;
  }, [playInLoop]);

  // Start Meditation with a given time (in seconds)
  const handleStartMeditation = (minutes) => {
    const timeInSeconds = minutes * 60;
    if (feeling.trim()) {
      setMeditationText(
        `Let's start with some calming breaths. Imagine the tension in your body melting away as you focus on each breath...`
      );
    } else {
      setMeditationText('Let me know how you feel today to start your personalized meditation.');
    }
    setSelectedTimeInMinutes(minutes); // Set the selected time
    setTimeRemaining(timeInSeconds);
    setRotationDegree(0); // Reset rotation degree to 0 (full circle)
    setTimerActive(true);
    handlePlayPause();
  };

  // Play/Pause functionality for meditation timer
  const handlePlayPause = () => {
    if (timerActive) {
      clearInterval(intervalId);
      setTimerActive(false);
      audioTune.current.pause();
    } else {
      audioTune.current.play();
      const id = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);
            setTimeRemaining(0); // Stop the timer at 0
            audioTune.current.pause(); // Stop the audi owhen the timer hits 0
            return 0;
          }
          return prevTime - 1;
        });

        // Update rotation degree for the animation
        setRotationDegree((prevDegree) => prevDegree + (360 / (selectedTimeInMinutes * 60 / timeRemaining)));
      }, 1000);
      setIntervalId(id);
      setTimerActive(true);
    }
  };

  // Handle replay
  const handleReplay = () => {
    setTimeRemaining(selectedTimeInMinutes * 60);
    clearInterval(intervalId);
    setTimerActive(false);
    setRotationDegree(0); // Reset rotation on replay
    audioTune.current.pause();
    audioTune.current.currentTime = 0; // Stop and reset audio
  };

  // Handle sound selection
  const handleSoundSelect = (sound) => {
    if (audioTune.current) {
      audioTune.current.pause();
      audioTune.current.currentTime = 0; // Stop any currently playing sound
    }
    audioTune.current = new Audio(sound);
    audioTune.current.loop = true; // Loop the audio
    audioTune.current.play(); // Play the new selected sound
    setSelectedSound(sound); // Track the selected sound
  };

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle the circle animation based on rotation
  const circleLength = 2 * Math.PI * 90; // Circumference of the circle (r=90)
  const strokeDashoffset = circleLength - (timeRemaining / (selectedTimeInMinutes * 60)) * circleLength;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Personalized Meditation Session</h1>
      <input
        type="text"
        placeholder="How are you feeling today?"
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
        style={styles.input}
      />
      <div style={styles.buttonContainer}>
        <button onClick={() => handleStartMeditation(1)} style={styles.startButton}>
          Start 1 Minute
        </button>
        <button onClick={() => handleStartMeditation(2)} style={styles.startButton}>
          Start 2 Minutes
        </button>
        <button onClick={() => handleStartMeditation(5)} style={styles.startButton}>
          Start 5 Minutes
        </button>
      </div>

      <p style={styles.meditationText}>{meditationText}</p>

      <div className="meditation">
        <div className="player-container" style={styles.playerContainer}>
          <button onClick={handlePlayPause} style={styles.playButton}>
            {timerActive ? 'Pause' : 'Play'}
          </button>

          <svg className="track-outline" width="200" height="200" style={styles.trackOutline}>
            <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="20" />
          </svg>

          <svg
            className="moving-outline"
            width="200"
            height="200"
            style={{
              ...styles.movingOutline,
              strokeDasharray: circleLength,
              strokeDashoffset: strokeDashoffset,
            }}
          >
            <circle cx="100" cy="100" r="90" stroke="#018EBA" strokeWidth="20" />
          </svg>

          <button onClick={handleReplay} style={styles.replayButton}>
            Replay
          </button>
          <h3 className="time-display" style={styles.timeDisplay}>
            {formatTime(timeRemaining)}
          </h3>
        </div>

        <div className="sound-picker" style={styles.soundPicker}>
          <button onClick={() => handleSoundSelect('/static/sounds/rain.mp3')} style={styles.soundButton}>
            Rain
          </button>
          <button onClick={() => handleSoundSelect('/static/sounds/beach.mp3')} style={styles.soundButton}>
            Beach
          </button>
        </div>
      </div>
    </div>
  );
};
// Inline styles for components
const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#e7f5ff',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '80%',
    borderRadius: '5px',
    border: '1px solid #bbb',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  startButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '30%',
  },
  meditationText: {
    fontSize: '16px',
    color: '#555',
    margin: '20px 0',
  },
  playerContainer: {
    position: 'relative',
    width: '200px',
    height: '200px',
    margin: 'auto',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit',
    padding: '10px',
    backgroundColor: '#018EBA',
    color: 'white',
    borderRadius: '50%',
    zIndex: 10,
  },
  trackOutline: {
    position: 'absolute',
    top: '0',
    left: '0',
  },
  movingOutline: {
    position: 'absolute',
    top: '0',
    left: '0',
    transition: 'stroke-dashoffset 1s linear',
  },
  replayButton: {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'fit',
    padding: '1px',
  },
  timeDisplay: {
    position: 'absolute',
    bottom: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
  },
  soundPicker: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
  },
  soundButton: {
    backgroundColor: '#fff',
    border: '2px solid #ccc',
    borderRadius: '50%',
    padding: '10px',
    margin: '0 10px',
    cursor: 'pointer',
  },
};

export default MeditationPage;
