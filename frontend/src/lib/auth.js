import axios from 'axios';

const AUTH_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const auth = {
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_KEY);
  },

  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  setSession: (token, userData) => {
    if (token) {
      localStorage.setItem(AUTH_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  login: async (email, password) => {
    try {
      // In a real app, this would be an API call
      // Simulated API response for demo
      const response = {
        token: 'demo_token_' + Math.random(),
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          role: 'user',
          preferences: {
            notifications: true,
            theme: 'light'
          }
        }
      };

      auth.setSession(response.token, response.user);
      return response.user;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  signup: async (email, password, name) => {
    try {
      // In a real app, this would be an API call
      // Simulated API response for demo
      const response = {
        token: 'demo_token_' + Math.random(),
        user: {
          id: Math.random().toString(),
          email,
          name,
          role: 'user',
          preferences: {
            notifications: true,
            theme: 'light'
          }
        }
      };

      auth.setSession(response.token, response.user);
      return response.user;
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    }
  },

  logout: () => {
    auth.setSession(null, null);
  },

  updateProfile: async (userData) => {
    try {
      // In a real app, this would be an API call
      const currentUser = auth.getUser();
      const updatedUser = { ...currentUser, ...userData };
      auth.setSession(localStorage.getItem(AUTH_KEY), updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error('Profile update failed.');
    }
  }
};