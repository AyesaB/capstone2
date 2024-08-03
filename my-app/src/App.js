import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [weights, setWeights] = useState([]);
  const [weight, setWeight] = useState('');
  const [weightDate, setWeightDate] = useState('');
  const [calories, setCalories] = useState([]);
  const [calorie, setCalorie] = useState('');
  const [calorieDate, setCalorieDate] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/weights', {
        headers: { 'x-auth-token': token }
      })
      .then(response => setWeights(response.data))
      .catch(error => console.error(error));

      axios.get('http://localhost:5000/calories', {
        headers: { 'x-auth-token': token }
      })
      .then(response => setCalories(response.data))
      .catch(error => console.error(error));
    }
  }, [token]);

  const addWeight = () => {
    if (!weightDate || !weight) {
      alert('Please fill in both date and weight.');
      return;
    }

    if (parseFloat(weight) < 80) { 
      alert('Weight must be at least 80 lbs.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (weightDate > today) {
      alert('Date cannot be in the future.');
      return;
    }

    axios.post('http://localhost:5000/weights', { date: weightDate, weight }, {
      headers: { 'x-auth-token': token }
    })
    .then(response => setWeights([...weights, response.data]))
    .catch(error => console.error(error));
  };

  const deleteWeight = id => {
    axios.delete(`http://localhost:5000/weights/${id}`, {
      headers: { 'x-auth-token': token }
    })
    .then(() => setWeights(weights.filter(w => w._id !== id)))
    .catch(error => console.error(error));
  };

  const addCalorie = () => {
    if (!calorieDate || !calorie) {
      alert('Please fill in both date and calorie count.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (calorieDate > today) {
      alert('Date cannot be in the future.');
      return;
    }

    axios.post('http://localhost:5000/calories', { date: calorieDate, calories: calorie }, {
      headers: { 'x-auth-token': token }
    })
    .then(response => setCalories([...calories, response.data]))
    .catch(error => console.error(error));
  };

  const deleteCalorie = id => {
    axios.delete(`http://localhost:5000/calories/${id}`, {
      headers: { 'x-auth-token': token }
    })
    .then(() => setCalories(calories.filter(c => c._id !== id)))
    .catch(error => console.error(error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUsername(''); 
  };

  if (!token) {
    return <Login setToken={(token) => {
      localStorage.setItem('token', token);
      setToken(token);
    }} setUsername={setUsername} />;
  }

  return (
    <div className="App">
      <div className="welcome-message">
        <h1>Hello {username}, welcome back!</h1>
        <p>Let's check and add your progress!</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <h1>Bodyweight Tracker</h1>
      <div className="input-container">
        <input
          type="date"
          value={weightDate}
          onChange={e => setWeightDate(e.target.value)}
        />
        <input
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          min="0"
          placeholder="Enter weight in pounds"
        />
        <button onClick={addWeight}>Add Weight</button>
      </div>
      <ul className="weight-list">
        {weights.map(w => (
          <li key={w._id} className="weight-item">
            <span className="weight-date">{new Date(w.date).toLocaleDateString('en-US')}</span>
            <span className="weight-value">{w.weight} lbs</span>
            <button onClick={() => deleteWeight(w._id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>

      <h1>Calorie Tracker</h1>
      <div className="input-container">
        <input
          type="date"
          value={calorieDate}
          onChange={e => setCalorieDate(e.target.value)}
        />
        <input
          type="number"
          value={calorie}
          onChange={e => setCalorie(e.target.value)}
          min="0"
          placeholder="Enter calories"
        />
        <button onClick={addCalorie}>Add Calorie</button>
      </div>
      <ul className="calorie-list">
        {calories.map(c => (
          <li key={c._id} className="calorie-item">
            <span className="calorie-date">{new Date(c.date).toLocaleDateString('en-US')}</span>
            <span className="calorie-value">{c.calories} kcal</span>
            <button onClick={() => deleteCalorie(c._id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
