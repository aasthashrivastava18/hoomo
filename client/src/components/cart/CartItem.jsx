import React from 'react';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const { id, name, price, quantity, image } = item;

  const handleQtyChange = (e) => {
    const val = Number(e.target.value);
    if (val > 0) {
      onQuantityChange(id, val);
    }
  };

  return (
    <div className="flex items-center border rounded p-4 shadow">
      {image && (
        <img 
          src={image} 
          alt={name} 
          className="w-20 h-20 object-cover rounded mr-6" 
        />
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">Price: ${price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <input 
          type="number" 
          min="1" 
          value={quantity} 
          onChange={handleQtyChange}
          className="w-16 border rounded p-1 text-center"
        />
        <button 
          onClick={() => onRemove(id)} 
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
