import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vendor/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/vendor/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Order Management</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id} className="border p-2 mb-2">
            <div>Order ID: {order._id}</div>
            <div>Status: {order.status}</div>
            <button onClick={() => updateStatus(order._id, 'Processing')} className="btn-sm mr-2">Processing</button>
            <button onClick={() => updateStatus(order._id, 'Delivered')} className="btn-sm">Delivered</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManagement;
