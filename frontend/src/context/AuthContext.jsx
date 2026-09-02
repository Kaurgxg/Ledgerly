import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ledgerly_user');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (token, userObj) => {
    localStorage.setItem('ledgerly_token', token);
    localStorage.setItem('ledgerly_user', JSON.stringify(userObj));
    setUser(userObj);
  };

  const login = useCallback(async ({ username, password, portal }) => {
    const { data } = await api.post('/auth/login', { username, password, portal });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ name, username, email, password, role, adminCode }) => {
    const { data } = await api.post('/auth/register', { name, username, email, password, role, adminCode });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ledgerly_token');
    localStorage.removeItem('ledgerly_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('ledgerly_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
