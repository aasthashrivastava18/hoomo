// Socket event names
module.exports = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Order events
  NEW_ORDER: 'new_order',
  ORDER_STATUS_UPDATED: 'order_status_updated',
  ORDER_ASSIGNED: 'order_assigned',
  TRY_AT_HOME_STATUS_UPDATED: 'try_at_home_status_updated',
  
  // Notification events
  NEW_NOTIFICATION: 'new_notification',
  
  // Stock events
  LOW_STOCK_ALERT: 'low_stock_alert',
  
  // Chat events
  JOIN_CHAT: 'join_chat',
  NEW_MESSAGE: 'new_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  
  // Delivery agent events
  LOCATION_UPDATE: 'location_update',
  DELIVERY_AGENT_AVAILABLE: 'delivery_agent_available',
  DELIVERY_AGENT_UNAVAILABLE: 'delivery_agent_unavailable'
};
