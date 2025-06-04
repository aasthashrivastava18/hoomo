import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
// Remove Redux imports since using Context
// import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../../context/CartContext'; // Add Context import
import { toast } from 'react-hot-toast'; // Change to react-hot-toast

const FeaturedProducts = ({ products: propProducts }) => { // Accept products as props
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]); // Local wishlist state
  
  // Use Context instead of Redux
  const { addToCart } = useCart();
  // Remove Redux hooks
  // const dispatch = useDispatch();
  // const wishlist = useSelector((state) => state.wishlist.items);
  
  useEffect(() => {
    // If products passed as props, use them
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      setLoading(false);
      return;
    }

    const fetchFeaturedProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockProducts = [
          {
            _id: 1, // Change id to _id for consistency
            name: 'Organic Avocado',
            description: 'Fresh organic avocados, perfect for guacamole or toast.',
            price: 2.99,
            image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            rating: 4.5,
            reviews: 128,
            vendor: 'Green Farms',
            category: 'Produce',
            discount: 0,
            isNew: true,
            isFeatured: true,
            stock: 45
          },
          {
            _id: 2,
            name: 'Artisan Sourdough Bread',
            description: 'Freshly baked artisan sourdough bread with a crispy crust.',
            price: 5.49,
            image: 'https://images.unsplash.com/photo-1585478259715-4d3a5f4a8771?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            rating: 4.8,
            reviews: 96,
            vendor: 'Downtown Bakery',
            category: 'Bakery',
            discount: 0,
            isNew: false,
            isFeatured: true,
            stock: 18
          },
          // Add more products...
        ];
        
        setProducts(mockProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to load featured products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, [propProducts]);
  
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };
  
  const handleAddToCart = (product) => {
    // Use Context method instead of Redux
    addToCart({
      _id: product._id, // Use _id
      name: product.name,
      price: product.price,
      image: product.image,
      vendor: product.vendor,
    });
    
    // Use react-hot-toast
    toast.success(`${product.name} added to cart!`);
  };
  
  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlist.some(item => item._id === product._id);
    
    if (isInWishlist) {
      setWishlist(prev => prev.filter(item => item._id !== product._id));
      toast.success(`${product.name} removed from wishlist`);
    } else {
      setWishlist(prev => [...prev, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        vendor: product.vendor
      }]);
      toast.success(`${product.name} added to wishlist!`);
    }
  };
  
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return (price - (price * discount / 100)).toFixed(2);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
        <Link to="/shop" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <Link to={`/product/${product._id}`}>
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                  }}
                />
              </Link>
              
              <button
                onClick={() => handleWishlistToggle(product)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors duration-200"
              >
                {wishlist.some(item => item._id === product._id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-600" />
                )}
              </button>
              
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}
              
              {product.isNew && !product.discount && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
            </div>
            
            <div className="p-4">
              <Link to={`/product/${product._id}`}>
                <h3 className="text-lg font-medium text-gray-800 hover:text-blue-600 mb-1">{product.name}</h3>
              </Link>
              
              <p className="text-sm text-gray-500 mb-2">{product.vendor}</p>
              
              <div className="flex items-center mb-2">
                <div className="flex mr-1">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  {product.discount > 0 ? (
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-800 mr-2">
                        ₹{calculateDiscountedPrice(product.price, product.discount)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-800">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  product.stock > 20
                    ? 'bg-green-100 text-green-800'
                    : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 20
                    ? 'In Stock'
                    : product.stock > 0
                      ? `Only ${product.stock} left`
                      : 'Out of Stock'}
                </span>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                  product.stock === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                <FaShoppingCart className="mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;

