import React, { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  // handle error msgs in component
  const [error, setError] = useState('');

  // handle retrieving data from previous component
  const location = useLocation();
  const userData = location.state;

  // recv payload from server
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    
    loadRecordsFromServer();

  }, []); // useEffect //

    // requests the data from server for incoming uuid
  const loadRecordsFromServer = async () => {
    // any prevention should go here...
    if (userData.uuid == '' || userData.uuid == null)
    {
      setError("UUID CAN NOT BE NULL");
      return null;
    }

    try {
      // Replace with your login API endpoint
      console.log('userData.uuid: ', userData.uuid);
      const response = await fetch("http://localhost:5000/api/getUserRecords", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(userData.uuid),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        console.log('response ok :)')
      } 
      else 
      {
        setError(result.error || "Login failed.");
      }
    } 
    catch (error) {
      setError("An error occurred. Please try again.");
    }
  }; // loadRecordsFromServer//

  // TODO
  const logout = () => {
    console.log("TODO: implement log out functionality");
  }; // logout


  const loadCurrentChallenge = () => {
    console.log('To Do: implement me!!!')
  };

  const loadPreviousChallenges = () => {
    console.log('TO DO: IMPLEMENT MEEE');
  };
    
  return (
    <div>
      {/* top level container for now */}
      <div style={styles.container}>
          {userData ? (
          <p>Welcome, {userData.email}! uuid: {userData.uuid}</p> 
        ) : (
          <p>No data available.</p>
        )}
      </div>

      {/* add buttons for current and previous challenges */}
      <button onClick={loadCurrentChallenge}>
        Current Challenge 
      </button>

      <br></br>

      <button onClick={loadPreviousChallenges}>
        Previous Challenge(s)
      </button>
    </div>
  );
}; // end of Dashboard component

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  currentChallenge: {
    flex: 1,
    margin: '10px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  previousChallenge: {
    flex: 1,
    margin: '10px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
};

export default Dashboard;
