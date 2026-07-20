import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // Check local storage for an existing user session on load
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login Action
  const login = async (email, password) => {
    // Note: Ensure this matches your actual backend login route!
    const { data } = await axios.post('http://localhost:5000/api/users/login', {
      email,
      password,
    });
    
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  // Logout Action
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};