import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file

function Login({ setToken, setUsername }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    try {
      const response = await axios.post(`http://localhost:5000/${endpoint}`, { username: usernameInput, password });
      setToken(response.data.token);
      setUsername(response.data.username); // Set the username from the response
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          type="button"
          className="switch-button"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </form>
    </div>
  );
}

export default Login;
