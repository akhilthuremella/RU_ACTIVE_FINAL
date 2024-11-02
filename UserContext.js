// UserContext.js
import React, { createContext, useContext, useState } from 'react';
import { auth } from './firebase'; // Optional, if using Firebase auth
import { signOut } from 'firebase/auth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    if (auth) {
      await signOut(auth); // Sign out with Firebase if you're using it
    }
    setUser(null); // Clear user state on logout
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
