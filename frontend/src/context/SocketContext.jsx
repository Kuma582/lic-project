import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Determine the base URL dynamically based on environment
    const BASE_URL = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');
      
    const newSocket = io(BASE_URL);
    setSocket(newSocket);

    // If user is logged in, join their private room
    const checkUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          newSocket.emit('join_user_room', user.id);
        } catch(e) {}
      }
    };
    
    // Slight delay to ensure connection is ready
    setTimeout(checkUser, 500);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
