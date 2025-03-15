import React from "react";

const ChallengeInfo = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>What is the 75 Hard Challenge?</h1>
      <p style={styles.description}>
        The 75 Hard Challenge is a transformative mental toughness program designed to push you beyond your limits and build discipline, resilience, and confidence. Over the course of 75 days, you'll follow strict rules to develop not just physical strength, but also a strong mindset.
      </p>
      <h2 style={styles.subTitle}>The Rules:</h2>
      <ul style={styles.list}>
        <li>Complete two 45-minute workouts each day, one of which must be outdoors.</li>
        <li>Follow a structured diet of your choice with no cheat meals or alcohol.</li>
        <li>Drink 1 gallon (3.7 liters) of water daily.</li>
        <li>Read 10 pages of a non-fiction or personal development book each day.</li>
        <li>Take a progress photo every day.</li>
      </ul>
      <p style={styles.warning}>
        <strong>Note:</strong> There are no rest days or exceptions. If you miss even one task, you must start over from day one.
      </p>
      <div style={styles.cta}>
        <p>Are you ready to challenge yourself?</p>
        <button style={styles.button} onClick={() => alert("Start your 75 Hard journey!")}>
          Take the Challenge
        </button>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "600px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "10px",
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6",
  },
  subTitle: {
    fontSize: "1.5rem",
    color: "#444",
    margin: "20px 0 10px",
  },
  list: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },
  warning: {
    color: "#d9534f",
    fontSize: "0.9rem",
    marginTop: "15px",
  },
  cta: {
    marginTop: "20px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ChallengeInfo;
