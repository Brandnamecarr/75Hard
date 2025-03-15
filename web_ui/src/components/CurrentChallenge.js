import React, { useState } from "react";

import ChallengeBox from "./ChallengeBox";

const CurrentChallenge = (data) => {
  // Array of data for the boxes
  const boxesData = [
    { id: 1, title: "Box 1", description: "This is the first box." },
    { id: 2, title: "Box 2", description: "This is the second box." },
    { id: 3, title: "Box 3", description: "This is the third box." },
  ];

  // State to manage modal visibility and selected box data
  const [selectedBox, setSelectedBox] = useState(null);

  // Function to handle box click
  const handleBoxClick = (box) => {
    setSelectedBox(box); // Set the selected box data
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedBox(null);
  };

  return (
    <div>
      <h1>Clickable Boxes</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        {boxesData.map((box) => (
          <div
            key={box.id}
            onClick={() => handleBoxClick(box)}
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: "lightblue",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {box.title}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBox && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h2>{selectedBox.title}</h2>
            <p>{selectedBox.description}</p>
            <button onClick={closeModal} style={{ marginTop: "10px" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentChallenge;
