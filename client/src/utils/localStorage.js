// src/utils/localStorage.js

export const setItem = (key, value) => {
  if (!key) return;
  try {
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, val);
  } catch (error) {
    console.error('Error setting item in localStorage:', error);
  }
};

export const getItem = (key) => {
  if (!key) return null;
  try {
    const val = localStorage.getItem(key);
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return null;
  }
};

export const removeItem = (key) => {
  if (!key) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};

export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Specific helper functions for token

export const getToken = () => {
  return getItem("token");
};

export const removeToken = () => {
  removeItem("token");
};

export const setToken = (token) => {
  setItem("token", token);
};


