import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'ADMIN' or 'USER'
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const navigate = useNavigate();

  // Load from local storage on initial mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const expiry = localStorage.getItem('sessionExpiry');
    
    if (authStatus === 'true' && role && expiry) {
      if (new Date().getTime() > parseInt(expiry, 10)) {
        // Session expired
        logout();
      } else {
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(email);
        setUserName(name || email?.split('@')[0] || 'User');
        setSessionExpiry(parseInt(expiry, 10));
      }
    }
  }, []);

  // Set timeout to clear session when it expires
  useEffect(() => {
    if (isAuthenticated && sessionExpiry) {
      const timeRemaining = sessionExpiry - new Date().getTime();
      if (timeRemaining > 0) {
        const timer = setTimeout(() => {
          logout();
          alert("Your session has expired. Please log in again.");
        }, timeRemaining);
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }
  }, [isAuthenticated, sessionExpiry]);

  const login = async (email, password) => {
    const response = await apiCall('/auth/login', 'POST', { email, password });
    
    if (response.status === 'success') {
      const { token, user } = response;
      const expiryTime = new Date().getTime() + 365 * 24 * 60 * 60 * 1000; // 365 days

      setIsAuthenticated(true);
      setUserRole(user.role);
      setUserEmail(user.email);
      setUserName(user.name || user.email.split('@')[0]);
      setSessionExpiry(expiryTime);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name || user.email.split('@')[0]);
      localStorage.setItem('sessionExpiry', expiryTime.toString());
      localStorage.setItem('token', token);

      return { success: true, role: user.role };
    } else {
      return { success: false, message: response.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    const response = await apiCall('/auth/register', 'POST', { name, email, password, confirmPassword });
    
    if (response.status === 'success') {
      const { token, user } = response;
      const expiryTime = new Date().getTime() + 365 * 24 * 60 * 60 * 1000; // 365 days

      setIsAuthenticated(true);
      setUserRole(user.role);
      setUserEmail(user.email);
      setUserName(user.name || name);
      setSessionExpiry(expiryTime);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name || name);
      localStorage.setItem('sessionExpiry', expiryTime.toString());
      localStorage.setItem('token', token);

      return { success: true };
    } else {
      return { success: false, message: response.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    setUserName(null);
    setSessionExpiry(null);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('token');
    
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail, userName, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
