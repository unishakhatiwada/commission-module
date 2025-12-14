import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './Dashboard';
function App() {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;