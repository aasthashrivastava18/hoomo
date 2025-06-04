import React from 'react';
import { Link } from 'react-router-dom';

const DealsOfTheDay = () => {
  const deals = [
    {
      id: 1,
      title: "Fresh Vegetables",
      discount: "30% OFF",
      image: "https://via.placeholder.com/300x200?text=Vegetables",
      originalPrice: 50,
      salePrice: 35
    },
    {
      id: 2,
      title: "Dairy Products",
      discount: "25% OFF", 
      image: "https://via.placeholder.com/300x200?text=Dairy",
      originalPrice: 40,
      salePrice: 30
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Deals of the Day</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">{deal.discount}</span>
                  <div className="text-right">
                    <span className="text-gray-500 line-through">${deal.originalPrice}</span>
                    <span className="text-xl font-bold text-green-600 ml-2">${deal.salePrice}</span>
                  </div>
                </div>
                <Link 
                  to="/deals" 
                  className="mt-4 block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsOfTheDay;
