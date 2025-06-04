import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShoppingCart, FaTshirt, FaUtensils, FaCarrot, FaMobileAlt, FaHome, FaBaby, FaHeartbeat, FaBook } from 'react-icons/fa';

const CategorySection = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Simulating data fetching
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const fetchCategories = async () => {
      setIsLoading(true);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockCategories = [
        {
          id: 'grocery',
          name: 'Grocery',
          icon: <FaShoppingCart />,
          color: 'bg-green-500',
          lightColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          count: 1240,
          subcategories: [
            { id: 'fresh-produce', name: 'Fresh Produce', icon: <FaCarrot /> },
            { id: 'dairy-eggs', name: 'Dairy & Eggs' },
            { id: 'bakery', name: 'Bakery' },
            { id: 'meat-seafood', name: 'Meat & Seafood' },
            { id: 'pantry-staples', name: 'Pantry Staples' },
            { id: 'beverages', name: 'Beverages' },
            { id: 'snacks', name: 'Snacks & Sweets' },
            { id: 'organic', name: 'Organic Foods' }
          ]
        },
        {
          id: 'clothing',
          name: 'Clothing',
          icon: <FaTshirt />,
          color: 'bg-purple-500',
          lightColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          count: 850,
          subcategories: [
            { id: 'mens', name: 'Men\'s Fashion' },
            { id: 'womens', name: 'Women\'s Fashion' },
            { id: 'kids', name: 'Kids\' Clothing' },
            { id: 'activewear', name: 'Activewear' },
            { id: 'shoes', name: 'Shoes' },
            { id: 'accessories', name: 'Accessories' },
            { id: 'jewelry', name: 'Jewelry' },
            { id: 'bags', name: 'Bags & Luggage' }
          ]
        },
        {
          id: 'restaurant',
          name: 'Restaurant',
          icon: <FaUtensils />,
          color: 'bg-red-500',
          lightColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          count: 620,
          subcategories: [
            { id: 'fast-food', name: 'Fast Food' },
            { id: 'pizza', name: 'Pizza' },
            { id: 'healthy', name: 'Healthy Options' },
            { id: 'asian', name: 'Asian Cuisine' },
            { id: 'italian', name: 'Italian' },
            { id: 'mexican', name: 'Mexican' },
            { id: 'desserts', name: 'Desserts & Bakeries' },
            { id: 'beverages', name: 'Beverages & Drinks' }
          ]
        },
        {
          id: 'electronics',
          name: 'Electronics',
          icon: <FaMobileAlt />,
          color: 'bg-blue-500',
          lightColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          count: 430,
          subcategories: [
            { id: 'smartphones', name: 'Smartphones' },
            { id: 'laptops', name: 'Laptops & Computers' },
            { id: 'audio', name: 'Audio & Headphones' },
            { id: 'tv-video', name: 'TV & Video' },
            { id: 'gaming', name: 'Gaming' },
            { id: 'smart-home', name: 'Smart Home' },
            { id: 'cameras', name: 'Cameras' },
            { id: 'accessories', name: 'Accessories' }
          ]
        },
        {
          id: 'home-garden',
          name: 'Home & Garden',
          icon: <FaHome />,
          color: 'bg-yellow-500',
          lightColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          count: 380,
          subcategories: [
            { id: 'furniture', name: 'Furniture' },
            { id: 'kitchen', name: 'Kitchen & Dining' },
            { id: 'decor', name: 'Home Decor' },
            { id: 'bedding', name: 'Bedding & Bath' },
            { id: 'garden', name: 'Garden & Outdoor' },
            { id: 'storage', name: 'Storage & Organization' },
            { id: 'appliances', name: 'Appliances' },
            { id: 'lighting', name: 'Lighting' }
          ]
        },
        {
          id: 'baby-kids',
          name: 'Baby & Kids',
          icon: <FaBaby />,
          color: 'bg-pink-500',
          lightColor: 'bg-pink-100',
          textColor: 'text-pink-700',
          borderColor: 'border-pink-200',
          count: 290,
          subcategories: [
            { id: 'baby-essentials', name: 'Baby Essentials' },
            { id: 'toys', name: 'Toys & Games' },
            { id: 'kids-clothing', name: 'Kids Clothing' },
            { id: 'baby-gear', name: 'Baby Gear' },
            { id: 'nursery', name: 'Nursery' },
            { id: 'feeding', name: 'Feeding & Nursing' },
            { id: 'diapering', name: 'Diapering' },
            { id: 'baby-toys', name: 'Baby Toys' }
          ]
        },
        {
          id: 'health-beauty',
          name: 'Health & Beauty',
          icon: <FaHeartbeat />,
          color: 'bg-teal-500',
          lightColor: 'bg-teal-100',
          textColor: 'text-teal-700',
          borderColor: 'border-teal-200',
          count: 520,
          subcategories: [
            { id: 'skincare', name: 'Skincare' },
            { id: 'makeup', name: 'Makeup' },
            { id: 'hair-care', name: 'Hair Care' },
            { id: 'fragrance', name: 'Fragrance' },
            { id: 'personal-care', name: 'Personal Care' },
            { id: 'health-wellness', name: 'Health & Wellness' },
            { id: 'vitamins', name: 'Vitamins & Supplements' },
            { id: 'bath-body', name: 'Bath & Body' }
          ]
        },
        {
          id: 'books-media',
          name: 'Books & Media',
          icon: <FaBook />,
          color: 'bg-indigo-500',
          lightColor: 'bg-indigo-100',
          textColor: 'text-indigo-700',
          borderColor: 'border-indigo-200',
          count: 340,
          subcategories: [
            { id: 'books', name: 'Books' },
            { id: 'ebooks', name: 'eBooks' },
            { id: 'audiobooks', name: 'Audiobooks' },
            { id: 'magazines', name: 'Magazines' },
            { id: 'movies', name: 'Movies & TV' },
            { id: 'music', name: 'Music' },
            { id: 'video-games', name: 'Video Games' },
            { id: 'collectibles', name: 'Collectibles' }
          ]
        }
      ];
      
      setCategories(mockCategories);
      setIsLoading(false);
    };
    
    fetchCategories();
  }, []);

  // Filter categories based on active tab
  const getDisplayedCategories = () => {
    if (activeTab === 'featured') {
      // Return first 6 categories for featured tab
      return categories.slice(0, 6);
    }
    return categories;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of products and services</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button 
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'featured' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Featured
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
          </div>
        </div>
        
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getDisplayedCategories().map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className={`p-6 border-b ${category.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${category.lightColor} ${category.textColor} rounded-lg flex items-center justify-center`}>
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                        <p className="text-gray-500">{category.count} items</p>
                      </div>
                    </div>
                    <Link 
                      to={`/category/${category.id}`} 
                      className={`${category.textColor} hover:underline flex items-center`}
                    >
                      <span className="mr-1">View All</span>
                      <FaArrowRight size={14} />
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {category.subcategories.slice(0, 6).map((subcategory) => (
                      <Link 
                        key={subcategory.id} 
                        to={`/category/${category.id}/${subcategory.id}`}
                        className="text-gray-700 hover:text-blue-600 hover:underline flex items-center text-sm py-1"
                      >
                        {subcategory.icon && <span className="mr-2">{subcategory.icon}</span>}
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                  
                  {category.subcategories.length > 6 && (
                    <div className="mt-4 text-center">
                      <Link 
                        to={`/category/${category.id}`} 
                        className={`text-sm ${category.textColor} hover:underline`}
                      >
                        +{category.subcategories.length - 6} more subcategories
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'featured' && !isLoading && (
          <div className="mt-10 text-center">
            <Link 
              to="/categories" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Categories
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
