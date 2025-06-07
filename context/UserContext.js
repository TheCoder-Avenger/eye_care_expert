"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const storedEmail = localStorage.getItem("user_email");

        if (storedEmail) {
          const response = await fetch("/api/users/check-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: storedEmail }),
          });

          if (response.ok) {
            const result = await response.json();
            setUser(result.user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("user_email");
          }
        }
      } catch (error) {
        console.error("Error checking existing user:", error);
        localStorage.removeItem("user_email");
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user_email", userData.email);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user_email");
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
