import React from 'react';
import { Link } from 'react-router-dom';

const ClothesCard = ({ item }) => {
  const { id, name, price, image } = item;

  return (
    <div className="border rounded shadow hover:shadow-lg transition p-4">
      <Link to={`/clothes/${id}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded mb-3"
        />
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-700 mt-1">${price.toFixed(2)}</p>
      </Link>
    </div>
  );
};

export default ClothesCard;
