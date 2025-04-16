import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('dormUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = (name, email, password) => {
    // In a real app, you would make an API call here
    const newUser = { id: Date.now().toString(), name, email, password };
    
    // Store users in localStorage
    const users = JSON.parse(localStorage.getItem('dormUsers') || '[]');
    users.push(newUser);
    localStorage.setItem('dormUsers', JSON.stringify(users));
    
    // Log in the user after registration
    login(email, password);
    
    return newUser;
  };

  // Login a user
  const login = (email, password) => {
    // In a real app, you would make an API call here
    const users = JSON.parse(localStorage.getItem('dormUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Don't store password in currentUser state
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('dormUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    
    return null;
  };

  // Logout a user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dormUser');
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
