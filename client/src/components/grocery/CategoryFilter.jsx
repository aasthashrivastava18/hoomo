import React, { useState } from 'react';

const CategoryFilter = ({ categories, onFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onFilter(category);
  };

  return (
    <div className="mb-6 p-4 border rounded">
      <label className="font-semibold mr-4">Filter by Category:</label>
      <select
        value={selectedCategory}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
