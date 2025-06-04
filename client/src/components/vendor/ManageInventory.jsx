import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageInventory = () => {
  const [products, setProducts] = useState([]);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vendor/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/vendor/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Inventory</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id} className="flex justify-between items-center border-b py-2">
            <div>
              <strong>{product.name}</strong> - ₹{product.price} (Stock: {product.stock})
            </div>
            <button onClick={() => handleDelete(product._id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageInventory;
