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
    }
  }, []);

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      userData.token
    );
  };

  // Merges partial updates into the current user and persists them.
  // Swap the localStorage write for an API call (e.g. authApi.updateProfile)
  // once a backend profile-update endpoint exists.
  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };

      localStorage.setItem(
        "user",
        JSON.stringify(next)
      );

      return next;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);