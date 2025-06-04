import { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import useAuth from './useAuth';

/**
 * Custom hook for managing WebSocket connections
 * @param {string} url - The WebSocket server URL (defaults to current origin)
 * @returns {Object} Socket-related state and functions
 */
const useSocket = (url = process.env.REACT_APP_API_URL || window.location.origin) => {
  const { isAuthenticated, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [events, setEvents] = useState([]);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !token) {
      return;
    }

    // Create socket connection with auth token
    const socket = io(url, {
      auth: {
        token
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt ${attemptNumber}`);
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    // Store socket reference
    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      if (socket) {
        console.log('Disconnecting socket');
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, token, url]);

  /**
   * Subscribe to a socket event
   * @param {string} eventName - The name of the event to subscribe to
   * @param {function} callback - The callback function to execute when event is received
   */
  const subscribe = useCallback((eventName, callback) => {
    if (!socketRef.current) return;

    // Add event to tracked events list
    setEvents(prev => {
      if (!prev.includes(eventName)) {
        return [...prev, eventName];
      }
      return prev;
    });

    // Set up event listener
    socketRef.current.on(eventName, (data) => {
      setLastMessage({ event: eventName, data });
      callback(data);
    });

    // Return unsubscribe function
    return () => {
      if (socketRef.current) {
        socketRef.current.off(eventName);
      }
    };
  }, []);

  /**
   * Unsubscribe from a socket event
   * @param {string} eventName - The name of the event to unsubscribe from
   */
  const unsubscribe = useCallback((eventName) => {
    if (!socketRef.current) return;

    socketRef.current.off(eventName);
    
    // Remove event from tracked events list
    setEvents(prev => prev.filter(e => e !== eventName));
  }, []);

  /**
   * Emit a socket event
   * @param {string} eventName - The name of the event to emit
   * @param {any} data - The data to send with the event
   * @returns {Promise} Resolves when acknowledgement is received
   */
  const emit = useCallback((eventName, data) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !isConnected) {
        reject(new Error('Socket not connected'));
        return;
      }

      socketRef.current.emit(eventName, data, (response) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }, [isConnected]);

  /**
   * Reconnect the socket
   */
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  /**
   * Disconnect the socket
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    lastMessage,
    events,
    subscribe,
    unsubscribe,
    emit,
    reconnect,
    disconnect
  };
};

export default useSocket;
