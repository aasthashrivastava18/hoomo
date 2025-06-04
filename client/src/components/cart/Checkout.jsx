import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../services/cartSlice';  // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.address || !form.phone) {
      alert('Please fill all fields');
      return;
    }

    // Here, normally you would call API to create order
    alert('Order placed successfully!');

    dispatch(clearCart());
    navigate('/');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Your cart is empty!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2"
            required 
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2"
            required 
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Address</label>
          <textarea 
            name="address" 
            value={form.address} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input 
            type="tel" 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2"
            required 
          />
        </div>
        <div className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</div>
        <button 
          type="submit" 
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
