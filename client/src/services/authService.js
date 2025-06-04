// import api from './api';
// import { handleApiError } from '../utils/errorHandler';

// class AuthService {
//   // Login user
//   async login(credentials) {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       const { token, refreshToken, user } = response.data;
      
//       // Store tokens
//       this.setTokens(token, refreshToken);
      
//       return { token, refreshToken, user };
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Register user
//   async register(userData) {
//     try {
//       const response = await api.post('/auth/register', userData);
//       const { token, refreshToken, user } = response.data;
      
//       // Store tokens
//       this.setTokens(token, refreshToken);
      
//       return { token, refreshToken, user };
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Vendor signup - MOVE INSIDE CLASS
//   async vendorSignup(vendorData) {
//     try {
//       const response = await api.post('/auth/vendor/register', vendorData);
//       const { token, refreshToken, user } = response.data;
      
//       // Store tokens
//       this.setTokens(token, refreshToken);
      
//       return { token, refreshToken, user };
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Restaurant owner signup - MOVE INSIDE CLASS
//   async restaurantSignup(restaurantData) {
//     try {
//       const response = await api.post('/auth/restaurant/register', restaurantData);
//       const { token, refreshToken, user } = response.data;
      
//       this.setTokens(token, refreshToken);
      
//       return { token, refreshToken, user };
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // ... rest of your existing methods (logout, refreshToken, etc.)

//   // Token management methods
//   setTokens(token, refreshToken) {
//     localStorage.setItem('accessToken', token);
//     localStorage.setItem('refreshToken', refreshToken);
//   }

//   getToken() {
//     return localStorage.getItem('accessToken');
//   }

//   getRefreshToken() {
//     return localStorage.getItem('refreshToken');
//   }

//   clearTokens() {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//   }

//   isAuthenticated() {
//     const token = this.getToken();
//     if (!token) return false;

//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.exp > Date.now() / 1000;
//     } catch {
//       return false;
//     }
//   }

//   getUserFromToken() {
//     const token = this.getToken();
//     if (!token) return null;

//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.user;
//     } catch {
//       return null;
//     }
//   }
// }

// const authService = new AuthService();
// export default authService;

// // ADD NAMED EXPORTS
// export const {
//   login,
//   register,
//   vendorSignup,
//   restaurantSignup,
//   logout,
//   refreshToken,
//   forgotPassword,
//   resetPassword,
//   changePassword,
//   verifyEmail,
//   resendVerificationEmail,
//   getCurrentUser,
//   updateProfile,
//   uploadProfilePicture,
//   socialLogin,
//   enable2FA,
//   verify2FA,
//   disable2FA
// } = authService;



// import api from './api';

// const AUTH_BASE = '/auth';

// export const login = async (credentials) => {
//   const response = await api.post(`${AUTH_BASE}/login`, credentials);
//   return response.data;
// };

// export const register = async (userData) => {
//   const response = await api.post(`${AUTH_BASE}/register`, userData);
//   return response.data;
// };

// export const registerVendor = async (vendorData) => {
//   const response = await api.post(`${AUTH_BASE}/vendor/register`, vendorData);
//   return response.data;
// };

// export const logout = async () => {
//   const response = await api.post(`${AUTH_BASE}/logout`);
//   return response.data;
// };

// export const getCurrentUser = async () => {
//   const response = await api.get(`${AUTH_BASE}/me`);
//   return response.data;
// };

// export const updateProfile = async (userData) => {
//   const response = await api.put(`${AUTH_BASE}/profile`, userData);
//   return response.data;
// };

// export const changePassword = async (passwordData) => {
//   const response = await api.put(`${AUTH_BASE}/change-password`, passwordData);
//   return response.data;
// };

// export const forgotPassword = async (email) => {
//   const response = await api.post(`${AUTH_BASE}/forgot-password`, { email });
//   return response.data;
// };

// export const resetPassword = async (resetData) => {
//   const response = await api.post(`${AUTH_BASE}/reset-password`, resetData);
//   return response.data;
// };
// import api from './api';
// import { handleApiError } from '../utils/errorHandler';

// class AuthService {
//   // Login user
//   async login(credentials) {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       const { data } = response.data;
      
//       // Store tokens
//       if (data.token) {
//         this.setTokens(data.token, data.refreshToken);
//       }
      
//       return data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Register user
//   async register(userData) {
//     try {
//       const response = await api.post('/auth/register', userData);
//       const { data } = response.data;
      
//       // Store tokens
//       if (data.token) {
//         this.setTokens(data.token, data.refreshToken);
//       }
      
//       return data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Vendor signup
//   async vendorSignup(vendorData) {
//     try {
//       const response = await api.post('/auth/vendor/register', vendorData);
//       const { data } = response.data;
      
//       // Store tokens
//       if (data.token) {
//         this.setTokens(data.token, data.refreshToken);
//       }
      
//       return data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Restaurant owner signup
//   async restaurantSignup(restaurantData) {
//     try {
//       const response = await api.post('/auth/restaurant/register', restaurantData);
//       const { data } = response.data;
      
//       this.setTokens(data.token, data.refreshToken);
//       return data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Logout
//   async logout() {
//     try {
//       await api.post('/auth/logout');
//       this.clearTokens();
//       return { success: true };
//     } catch (error) {
//       // Clear tokens even if API call fails
//       this.clearTokens();
//       throw handleApiError(error);
//     }
//   }

//   // Get current user
//   async getCurrentUser() {
//     try {
//       const response = await api.get('/auth/me');
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Update profile
//   async updateProfile(userData) {
//     try {
//       const response = await api.put('/auth/profile', userData);
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Change password
//   async changePassword(passwordData) {
//     try {
//       const response = await api.put('/auth/change-password', passwordData);
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Forgot password
//   async forgotPassword(email) {
//     try {
//       const response = await api.post('/auth/forgot-password', { email });
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Reset password
//   async resetPassword(resetData) {
//     try {
//       const response = await api.post('/auth/reset-password', resetData);
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Verify email
//   async verifyEmail(token) {
//     try {
//       const response = await api.post('/auth/verify-email', { token });
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Resend verification email
//   async resendVerificationEmail(email) {
//     try {
//       const response = await api.post('/auth/resend-verification', { email });
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Upload profile picture
//   async uploadProfilePicture(file) {
//     try {
//       const formData = new FormData();
//       formData.append('avatar', file);
      
//       const response = await api.post('/auth/upload-avatar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Social login
//   async socialLogin(provider, token) {
//     try {
//       const response = await api.post(`/auth/social/${provider}`, { token });
//       const { data } = response.data;
      
//       if (data.token) {
//         this.setTokens(data.token, data.refreshToken);
//       }
      
//       return data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Enable 2FA
//   async enable2FA() {
//     try {
//       const response = await api.post('/auth/2fa/enable');
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Verify 2FA
//   async verify2FA(code) {
//     try {
//       const response = await api.post('/auth/2fa/verify', { code });
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Disable 2FA
//   async disable2FA(password) {
//     try {
//       const response = await api.post('/auth/2fa/disable', { password });
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Refresh token
//   async refreshToken() {
//     try {
//       const refreshToken = this.getRefreshToken();
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }

//       const response = await api.post('/auth/refresh-token', { refreshToken });
//       const { data } = response.data;
      
//       this.setTokens(data.token, data.refreshToken);
//       return data;
//     } catch (error) {
//       this.clearTokens();
//       throw handleApiError(error);
//     }
//   }

//   // Token management methods
//   setTokens(token, refreshToken) {
//     localStorage.setItem('token', token);
//     localStorage.setItem('accessToken', token);
//     if (refreshToken) {
//       localStorage.setItem('refreshToken', refreshToken);
//     }
//   }

//   getToken() {
//     return localStorage.getItem('token') || localStorage.getItem('accessToken');
//   }

//   getRefreshToken() {
//     return localStorage.getItem('refreshToken');
//   }

//   clearTokens() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//   }

//   isAuthenticated() {
//     const token = this.getToken();
//     if (!token) return false;
    
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.exp > Date.now() / 1000;
//     } catch {
//       return false;
//     }
//   }

//   getUserFromToken() {
//     const token = this.getToken();
//     if (!token) return null;
    
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.user || payload;
//     } catch {
//       return null;
//     }
//   }

//   // Get user role
//   getUserRole() {
//     const user = this.getUserFromToken();
//     return user?.role || null;
//   }

//   // Check if user has specific role
//   hasRole(role) {
//     const userRole = this.getUserRole();
//     return userRole === role;
//   }

//   // Check if user is admin
//   isAdmin() {
//     return this.hasRole('admin');
//   }

//   // Check if user is vendor
//   isVendor() {
//     return this.hasRole('vendor');
//   }

//   // Check if user is customer
//   isCustomer() {
//     return this.hasRole('customer');
//   }
// }

// // Create and export instance
// const authService = new AuthService();
// export default authService;

// // Named exports for convenience
// export const {
//   login,
//   register,
//   vendorSignup,
//   restaurantSignup,
//   logout,
//   refreshToken,
//   forgotPassword,
//   resetPassword,
//   changePassword,
//   verifyEmail,
//   resendVerificationEmail,
//   getCurrentUser,
//   updateProfile,
//   uploadProfilePicture,
//   socialLogin,
//   enable2FA,
//   verify2FA,
//   disable2FA
// } = authService;

// // Additional utility exports
// export const {
//   isAuthenticated,
//   getUserFromToken,
//   getUserRole,
//   hasRole,
//   isAdmin,
//   isVendor,
//   isCustomer,
//   getToken,
//   clearTokens
// } = authService;
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Customer/User login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Customer registration
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Vendor signup
  async vendorSignup(vendorData) {
    try {
      const response = await api.post('/auth/vendor/signup', vendorData);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Vendor registration failed'
      };
    }
  },

  // Verify token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Token verification failed'
      };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed'
      };
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed'
      };
    }
  },

  // Update profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed'
      };
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post('/auth/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload profile picture'
      };
    }
  }
};

// Export individual functions for backward compatibility
export const login = authService.login;
export const register = authService.register;
export const vendorSignup = authService.vendorSignup;
export const logout = authService.logout;
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;
export const updateProfile = authService.updateProfile;
export const changePassword = authService.changePassword;

export default authService;
