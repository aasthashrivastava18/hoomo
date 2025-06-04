// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import authService from '../services/authService';

// // Initial state
// const initialState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   isLoading: true,
//   error: null
// };

// // Action types
// const AUTH_ACTIONS = {
//   LOGIN_START: 'LOGIN_START',
//   LOGIN_SUCCESS: 'LOGIN_SUCCESS',
//   LOGIN_FAILURE: 'LOGIN_FAILURE',
//   LOGOUT: 'LOGOUT',
//   REGISTER_START: 'REGISTER_START',
//   REGISTER_SUCCESS: 'REGISTER_SUCCESS',
//   REGISTER_FAILURE: 'REGISTER_FAILURE',
//   LOAD_USER_START: 'LOAD_USER_START',
//   LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
//   LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
//   UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
//   CLEAR_ERROR: 'CLEAR_ERROR',
//   SET_LOADING: 'SET_LOADING'
// };

// // Reducer
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case AUTH_ACTIONS.LOGIN_START:
//     case AUTH_ACTIONS.REGISTER_START:
//     case AUTH_ACTIONS.LOAD_USER_START:
//       return {
//         ...state,
//         isLoading: true,
//         error: null
//       };

//     case AUTH_ACTIONS.LOGIN_SUCCESS:
//     case AUTH_ACTIONS.REGISTER_SUCCESS:
//       return {
//         ...state,
//         user: action.payload.user,
//         token: action.payload.token,
//         isAuthenticated: true,
//         isLoading: false,
//         error: null
//       };

//     case AUTH_ACTIONS.LOAD_USER_SUCCESS:
//     case AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS:
//       return {
//         ...state,
//         user: action.payload,
//         isLoading: false,
//         error: null
//       };

//     case AUTH_ACTIONS.LOGIN_FAILURE:
//     case AUTH_ACTIONS.REGISTER_FAILURE:
//     case AUTH_ACTIONS.LOAD_USER_FAILURE:
//       return {
//         ...state,
//         user: null,
//         token: null,
//         isAuthenticated: false,
//         isLoading: false,
//         error: action.payload
//       };

//     case AUTH_ACTIONS.LOGOUT:
//       return {
//         ...initialState,
//         isLoading: false
//       };

//     case AUTH_ACTIONS.CLEAR_ERROR:
//       return {
//         ...state,
//         error: null
//       };

//     case AUTH_ACTIONS.SET_LOADING:
//       return {
//         ...state,
//         isLoading: action.payload
//       };

//     default:
//       return state;
//   }
// };

// // Create context
// const AuthContext = createContext();

// // Auth provider component
// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Load user on app start
//   useEffect(() => {
//     loadUser();
//   }, []);

//   // Load user from token
//   const loadUser = async () => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });

//       if (authService.isAuthenticated()) {
//         const userData = await authService.getCurrentUser();
//         dispatch({
//           type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
//           payload: userData
//         });
//       } else {
//         dispatch({
//           type: AUTH_ACTIONS.LOAD_USER_FAILURE,
//           payload: 'No valid token found'
//         });
//       }
//     } catch (error) {
//       dispatch({
//         type: AUTH_ACTIONS.LOAD_USER_FAILURE,
//         payload: error.message
//       });
//     }
//   };

//   // Login function
//   const login = async (credentials) => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.LOGIN_START });

//       const response = await authService.login(credentials);
      
//       dispatch({
//         type: AUTH_ACTIONS.LOGIN_SUCCESS,
//         payload: response
//       });

//       return response;
//     } catch (error) {
//       dispatch({
//         type: AUTH_ACTIONS.LOGIN_FAILURE,
//         payload: error.message
//       });
//       throw error;
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.REGISTER_START });

//       const response = await authService.register(userData);
      
//       dispatch({
//         type: AUTH_ACTIONS.REGISTER_SUCCESS,
//         payload: response
//       });

//       return response;
//     } catch (error) {
//       dispatch({
//         type: AUTH_ACTIONS.REGISTER_FAILURE,
//         payload: error.message
//       });
//       throw error;
//     }
//   };

//   // Vendor signup
//   const vendorSignup = async (vendorData) => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.REGISTER_START });

//       const response = await authService.vendorSignup(vendorData);
      
//       dispatch({
//         type: AUTH_ACTIONS.REGISTER_SUCCESS,
//         payload: response
//       });

//       return response;
//     } catch (error) {
//       dispatch({
//         type: AUTH_ACTIONS.REGISTER_FAILURE,
//         payload: error.message
//       });
//       throw error;
//     }
//   };

//   // Restaurant signup
//   const restaurantSignup = async (restaurantData) => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.REGISTER_START });

//       const response = await authService.restaurantSignup(restaurantData);
      
//       dispatch({
//         type: AUTH_ACTIONS.REGISTER_SUCCESS,
//         payload: response
//       });

//       return response;
//     } catch (error) {
//       dispatch({
//         type: AUTH_ACTIONS.REGISTER_FAILURE,
//         payload: error.message
//       });
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await authService.logout();
//       dispatch({ type: AUTH_ACTIONS.LOGOUT });
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Force logout even if API call fails
//       dispatch({ type: AUTH_ACTIONS.LOGOUT });
//     }
//   };

//   // Update profile
//   const updateProfile = async (userData) => {
//     try {
//       const updatedUser = await authService.updateProfile(userData);
      
//       dispatch({
//         type: AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS,
//         payload: updatedUser
//       });

//       return updatedUser;
//     } catch (error) {
//       dispatch({
//         type: AUTH_ACTIONS.LOGIN_FAILURE,
//         payload: error.message
//       });
//       throw error;
//     }
//   };

//   // Forgot password
//   const forgotPassword = async (email) => {
//     try {
//       return await authService.forgotPassword(email);
//     } catch (error) {
//       throw error;
//     }
//   };

//   // Reset password
//   const resetPassword = async (token, newPassword) => {
//     try {
//       return await authService.resetPassword(token, newPassword);
//     } catch (error) {
//       throw error;
//     }
//   };

//   // Change password
//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       return await authService.changePassword(currentPassword, newPassword);
//     } catch (error) {
//       throw error;
//     }
//   };

//   // Clear error
//   const clearError = () => {
//     dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
//   };

//   // Set loading
//   const setLoading = (loading) => {
//     dispatch({ 
//       type: AUTH_ACTIONS.SET_LOADING, 
//       payload: loading 
//     });
//   };

//   // Check if user has specific role
//   const hasRole = (role) => {
//     return state.user?.role === role;
//   };

//   // Check if user has any of the specified roles
//   const hasAnyRole = (roles) => {
//     return roles.includes(state.user?.role);
//   };

//   // Check if user has permission
//   const hasPermission = (permission) => {
//     return state.user?.permissions?.includes(permission);
//   };

//   // Get user initials for avatar
//   const getUserInitials = () => {
//     if (!state.user) return '';
    
//     const firstName = state.user.firstName || '';
//     const lastName = state.user.lastName || '';
    
//     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
//   };

//   // Get user display name
//   const getUserDisplayName = () => {
//     if (!state.user) return '';
    
//     return `${state.user.firstName || ''} ${state.user.lastName || ''}`.trim() 
//            || state.user.email 
//            || 'User';
//   };

//   const value = {
//     // State
//     ...state,
    
//     // Actions
//     login,
//     register,
//     vendorSignup,
//     restaurantSignup,
//     logout,
//     updateProfile,
//     forgotPassword,
//     resetPassword,
//     changePassword,
//     loadUser,
//     clearError,
//     setLoading,
    
//     // Utility functions
//     hasRole,
//     hasAnyRole,
//     hasPermission,
//     getUserInitials,
//     getUserDisplayName
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
  
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
  
//   return context;
// };

// export default AuthContext;


import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  userType: null // 'customer', 'vendor', 'admin'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
        
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        userType: action.payload.userType,
        isAuthenticated: true,
        loading: false,
        error: null
      };
        
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        userType: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
        
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
        
    case 'CLEAR_ERROR':
      return { ...state, error: null };
        
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
        
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const response = await authService.verifyToken();
      if (response.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.user,
            userType: response.user.userType || 'customer'
          }
        });
      } else {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email, password, rememberMe = false, userType = 'customer') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
            
      const response = await authService.login({
        email,
        password,
        userType
      });

      if (response.success) {
        // Store token based on remember me preference
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', response.token);
                
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.user,
            userType: response.user.userType || userType
          }
        });
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData, userType = 'customer') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
            
      const response = await authService.register({
        ...userData,
        userType
      });

      if (response.success) {
        // Auto login after registration
        sessionStorage.setItem('token', response.token);
                
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.user,
            userType: response.user.userType || userType
          }
        });
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const vendorSignup = async (vendorData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
            
      const response = await authService.vendorSignup(vendorData);

      if (response.success) {
        // Auto login after vendor registration
        sessionStorage.setItem('token', response.token);
                
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.user,
            userType: 'vendor'
          }
        });
        return response;
      } else {
        throw new Error(response.message || 'Vendor registration failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  // Additional helper functions
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.updateProfile(userData);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.user });
        toast.success('Profile updated successfully');
        return response;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        toast.success('Password changed successfully');
        return response;
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const forgotPassword = async (email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        toast.success('Password reset email sent successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetPassword = async (token, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.resetPassword(token, password);
      
      if (response.success) {
        toast.success('Password reset successfully');
        return response;
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Helper functions for role checking
  const isCustomer = () => state.userType === 'customer';
  const isVendor = () => state.userType === 'vendor';
  const isAdmin = () => state.userType === 'admin';

  const value = {
    ...state,
    login,
    register,
    vendorSignup,
    logout,
    updateUser,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    checkAuthStatus,
    isCustomer,
    isVendor,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
