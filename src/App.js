import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { motion } from 'framer-motion';

function App() {
  // Stage 1 states
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [stage1Completed, setStage1Completed] = useState(false);

  // Stage 2 states
  const [stage2Completed, setStage2Completed] = useState(false);

  // Handle user input for Stage 1
  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  // Handle form submission for Stage 1 (GET request)
  const handleStage1Submit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is required!');
      return;
    }

    try {
      // Construct the URL using user input (userId)
      const url = `https://uber-task-backend-v1.onrender.com/jira/similarity/${userId}`;

      // Make the GET request
      const response = await axios.get(url);

      // Set the response data in state
      setUserData(response.data);
      setStage1Completed(true); // Mark Stage 1 as completed
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Failed to fetch data. Please check the User ID or try again.');
      setUserData(null); // Clear previous data in case of error
    }
  };

  // Handle form submission for Stage 2 (POST request)
  const handleStage2Submit = async (e) => {
    e.preventDefault();

    if (!userData || !userData["data"]) {
      setError('No data available to post!');
      return;
    }

    try {
      // Construct the POST URL for Stage 2
      const url = `https://uber-task-backend-v1.onrender.com/jira`;

      // Data to send in POST request (using userData from Stage 1)
      const postData = userData["data"];

      // Make the POST request
      const response = await axios.post(url, postData);

      // Set Stage 2 as completed
      setStage2Completed(true);
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Failed to submit data to Stage 2. Please try again.');
    }
  };

  return (
    <div className="App">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>Pipeline UI</motion.h1>

      <div className="pipeline-container">
        {/* Stage 1 */}
        <motion.div
          className={`stage pipeline-stage ${stage1Completed ? 'pipeline-completed' : 'pipeline-active'}`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Stage 1: Check duplicates</h2>
          <form onSubmit={handleStage1Submit}>
            <input
              type="text"
              value={userId}
              onChange={handleInputChange}
              placeholder="Enter User ID"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Submit issue key
            </motion.button>
          </form>
          {userData && (
            <div className="user-data">
              <h3>Possible duplicate T3's</h3>
              <pre>{JSON.stringify(userData['results'], null, 2)}</pre>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          {stage1Completed && <p className="stage-completed">Stage 1 completed!</p>}
          <div className="pipeline-line"></div>
        </motion.div>

        {/* Stage 2 */}
        {stage1Completed && (
          <motion.div
            className={`stage pipeline-stage ${stage2Completed ? 'pipeline-completed' : 'pipeline-active'}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Stage 2: T3 creation</h2>
            {userData && userData["data"] && (
              <div className="user-data-preview">
                <h3>Data to be Submitted:</h3>
                <pre>{JSON.stringify(userData["data"], null, 2)}</pre>
              </div>
            )}
            <form onSubmit={handleStage2Submit}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Create T3
              </motion.button>
            </form>
            {error && <p className="error">{error}</p>}
            <div className="pipeline-line"></div>
          </motion.div>
        )}
      </div>

      {stage2Completed && !error && (
        <motion.p className="stage-completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Pipeline Completed!
        </motion.p>
      )}
    </div>
  );
}

export default App;
