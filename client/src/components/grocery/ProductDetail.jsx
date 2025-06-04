import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { addToCart } from '../../services/cartSlice'; // adjust import path

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const groceryList = useSelector(state => state.grocery.items);
  const product = groceryList.find(p => p.id.toString() === id);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="p-6 text-center">Product not found.</div>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    alert('Added to cart!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      <img
        src={product.image}
        alt={product.name}
        className="w-full md:w-1/2 h-auto object-cover rounded"
      />
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
        <p className="mb-6">{product.description || 'No description available.'}</p>

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
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
