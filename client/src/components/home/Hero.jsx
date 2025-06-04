import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaStore, FaUtensils, FaTshirt } from 'react-icons/fa';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would redirect to search results page with the query and category
    window.location.href = `/search?q=${searchQuery}&category=${searchCategory}`;
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Hero Content */}
          <div className="md:w-1/2 text-white mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Everything You Need, <br />
              <span className="text-yellow-300">All in One Place</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Shop groceries, clothing, and restaurant meals from local vendors with fast delivery to your doorstep.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-lg mb-8 max-w-xl">
              <div className="flex-1 flex">
                <select 
                  className="bg-white text-gray-700 py-3 px-4 outline-none w-32"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="grocery">Grocery</option>
                  <option value="clothing">Clothing</option>
                  <option value="restaurant">Restaurant</option>
                </select>
                <input
                  type="text"
                  placeholder="Search for products, stores, or restaurants..."
                  className="flex-1 py-3 px-4 outline-none text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 transition duration-300"
              >
                <FaSearch className="inline mr-2" />
                Search
              </button>
            </form>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/how-it-works" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                How It Works
              </Link>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Main Image */}
              <div className="bg-white p-4 rounded-lg shadow-xl transform rotate-3 max-w-md">
                <img 
                  src="/images/hero-shopping.jpg" 
                  alt="Online shopping experience" 
                  className="rounded-md w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x350/f3f4f6/1e40af?text=Shopping+Made+Easy';
                  }}
                />
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-blue-800 font-bold py-2 px-4 rounded-lg shadow-md transform rotate-3">
                  Fast Delivery!
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -left-10 bg-green-500 p-4 rounded-full shadow-lg animate-bounce-slow">
                <FaShoppingCart className="text-white text-3xl" />
              </div>
              
              <div className="absolute -bottom-5 -left-8 bg-red-500 p-4 rounded-full shadow-lg animate-pulse">
                <FaUtensils className="text-white text-3xl" />
              </div>
              
              <div className="absolute top-1/4 -right-10 bg-purple-500 p-4 rounded-full shadow-lg animate-bounce-slow animation-delay-500">
                <FaTshirt className="text-white text-3xl" />
              </div>
              
              <div className="absolute bottom-1/3 right-1/4 bg-blue-500 p-4 rounded-full shadow-lg animate-pulse animation-delay-700">
                <FaStore className="text-white text-3xl" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
            <div className="text-blue-100">Local Vendors</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50,000+</div>
            <div className="text-blue-100">Products</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">30 min</div>
            <div className="text-blue-100">Average Delivery</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.8/5</div>
            <div className="text-blue-100">Customer Rating</div>
          </div>
        </div>
        
        {/* Category Quick Links */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Shop By Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link to="/category/grocery" className="group">
              <div className="bg-white bg-opacity-90 rounded-lg p-6 transform transition duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Groceries</h3>
                <p className="text-gray-600 mb-4">Fresh produce, pantry essentials, and more</p>
                <span className="text-green-600 font-medium group-hover:underline">Shop Now</span>
              </div>
            </Link>
            
            <Link to="/category/clothing" className="group">
              <div className="bg-white bg-opacity-90 rounded-lg p-6 transform transition duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaTshirt className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Clothing</h3>
                <p className="text-gray-600 mb-4">Fashion for everyone from local boutiques</p>
                <span className="text-purple-600 font-medium group-hover:underline">Shop Now</span>
              </div>
            </Link>
            
            <Link to="/category/restaurant" className="group">
              <div className="bg-white bg-opacity-90 rounded-lg p-6 transform transition duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaUtensils className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Restaurants</h3>
                <p className="text-gray-600 mb-4">Delicious meals from local restaurants</p>
                <span className="text-red-600 font-medium group-hover:underline">Order Now</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
          <path d="M0,96L60,80C120,64,240,32,360,32C480,32,600,64,720,69.3C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
