import React, { useState, useEffect } from 'react';
// StockManagement.jsx - Line 2 (CORRECT)
import clothesService from '../../services/clothesService';

import Loader from '../common/Loader';

const StockManagement = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clothesService.getStock()
      .then(data => {
        setStockItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Stock Management</h2>
      {stockItems.length === 0 ? (
        <p>No stock data available.</p>
      ) : (
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-2">Item</th>
              <th className="border border-gray-300 px-3 py-2">Available Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map(item => (
              <tr key={item._id}>
                <td className="border border-gray-300 px-3 py-2">{item.name}</td>
                <td className="border border-gray-300 px-3 py-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockManagement;
