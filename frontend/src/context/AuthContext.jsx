// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (
        storedUser &&
        storedUser !== "undefined"
      ) {
        setUser(
          JSON.parse(
            storedUser
          )
        );
      }
    } catch (error) {
      console.error(
        "Auth Parse Error:",
        error
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );
    }
  }, []);

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    if (userData?.token) {
      localStorage.setItem(
        "token",
        userData.token
      );
    }
  };

  const updateUser = (updates) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        ...updates,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );

      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        updateUser,
        logout,
        isAuthenticated:
          !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export default AuthProvider;