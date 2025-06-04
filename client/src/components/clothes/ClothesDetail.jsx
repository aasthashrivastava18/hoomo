import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { addToCart } from '../../services/cartSlice'; // adjust path as needed

const ClothesDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Assuming you have a clothes list in redux or context or fetch from API
  const clothesList = useSelector(state => state.clothes.items);
  const item = clothesList.find(c => c.id.toString() === id);

  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return <div className="p-6 text-center">Clothing item not found.</div>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...item, quantity }));
    alert('Added to cart!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full md:w-1/2 h-auto object-cover rounded" 
      />
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
        <p className="text-xl font-semibold mb-4">${item.price.toFixed(2)}</p>
        <p className="mb-6">{item.description || 'No description available.'}</p>

        <div className="flex items-center mb-6 space-x-4">
          <label htmlFor="quantity" className="font-medium">Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 border rounded px-2 py-1 text-center"
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ClothesDetail;
