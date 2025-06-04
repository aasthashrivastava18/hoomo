import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaSearch, FaShoppingCart } from 'react-icons/fa';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularCategories = [
    { name: 'Fruits & Vegetables', path: '/grocery?category=fruits', icon: '🥕' },
    { name: 'Dairy Products', path: '/grocery?category=dairy', icon: '🥛' },
    { name: 'Bakery Items', path: '/grocery?category=bakery', icon: '🍞' },
    { name: 'Snacks', path: '/grocery?category=snacks', icon: '🍿' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4 animate-bounce">
            404
          </div>
          <div className="text-6xl mb-4">🛒💔</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for seems to have wandered off like a shopping cart in a parking lot. 
            Don't worry, we'll help you find your way back!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaHome className="mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>

          <Link
            to="/grocery"
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full"
          >
            <FaShoppingCart className="mr-2" />
            Start Shopping
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Or explore popular categories:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {popularCategories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm font-medium text-gray-700">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-center mb-3">
            <FaSearch className="text-gray-400 mr-2" />
            <span className="text-gray-600">Looking for something specific?</span>
          </div>
          <Link
            to="/grocery"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try our search feature →
          </Link>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-sm text-gray-500">
          <p>💡 Fun fact: The average person spends 43 minutes per week grocery shopping!</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-10 left-10 text-4xl animate-pulse opacity-20">🥕</div>
      <div className="fixed top-20 right-20 text-3xl animate-bounce opacity-20">🍎</div>
      <div className="fixed bottom-20 left-20 text-3xl animate-pulse opacity-20">🥛</div>
      <div className="fixed bottom-10 right-10 text-4xl animate-bounce opacity-20">🍞</div>
    </div>
  );
};

export default NotFoundPage;

