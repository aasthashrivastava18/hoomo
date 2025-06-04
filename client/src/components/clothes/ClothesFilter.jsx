import React, { useState } from 'react';

const ClothesFilter = ({ onFilter }) => {
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleApplyFilter = () => {
    onFilter({ category, priceRange });
  };

  return (
    <div className="border rounded p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Filter Clothes</h2>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Price Range</label>
        <select
          value={priceRange}
          onChange={e => setPriceRange(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">All</option>
          <option value="0-50">Up to $50</option>
          <option value="50-100">$50 to $100</option>
          <option value="100-200">$100 to $200</option>
          <option value="200+">$200+</option>
        </select>
      </div>

      <button
        onClick={handleApplyFilter}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default ClothesFilter;
