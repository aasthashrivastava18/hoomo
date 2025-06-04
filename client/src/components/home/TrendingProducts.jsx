import React from 'react';
import { Link } from 'react-router-dom';

const TrendingProducts = ({ products = [] }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Trending Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={product.image || "https://via.placeholder.com/300x200?text=Product"} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-xl font-bold text-green-600">${product.price}</p>
                  <Link 
                    to={`/products/${product.id}`}
                    className="mt-3 block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No trending products available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
