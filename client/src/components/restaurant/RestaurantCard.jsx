import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaMotorcycle, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
// import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-hot-toast';

const RestaurantCard = ({ restaurant, className = '' }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const isInWishlist = wishlistItems.some(item => item.id === restaurant.id && item.type === 'restaurant');
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist({ id: restaurant.id, type: 'restaurant' }));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist({ ...restaurant, type: 'restaurant' }));
      toast.success('Added to wishlist');
    }
  };
  
  const getDeliveryTimeColor = (time) => {
    if (time <= 30) return 'text-green-600';
    if (time <= 45) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'bg-green-500';
    if (rating >= 4.0) return 'bg-green-400';
    if (rating >= 3.5) return 'bg-yellow-500';
    if (rating >= 3.0) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <Link to={`/restaurant/${restaurant.id}`} className="block">
        <div className="relative">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Restaurant+Image';
            }}
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? (
              <FaHeart className="h-5 w-5 text-red-500" />
            ) : (
              <FaRegHeart className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              restaurant.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          
          {/* Discount Badge */}
          {restaurant.discount && restaurant.discount > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                {restaurant.discount}% OFF
              </span>
            </div>
          )}
          
          {/* Featured Badge */}
          {restaurant.isFeatured && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 text-xs font-bold bg-yellow-500 text-white rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          {/* Restaurant Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {restaurant.name}
          </h3>
          
          {/* Cuisine Types */}
          <p className="text-sm text-gray-600 mb-2 truncate">
            {restaurant.cuisineTypes?.join(', ') || 'Various Cuisines'}
          </p>
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <FaMapMarkerAlt className="h-4 w-4 mr-1 text-gray-400" />
            <span className="truncate">{restaurant.address}</span>
          </div>
          
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className={`flex items-center px-2 py-1 rounded text-white text-sm font-medium ${getRatingColor(restaurant.rating)}`}>
                <FaStar className="h-3 w-3 mr-1" />
                <span>{restaurant.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({restaurant.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
          
          {/* Delivery Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <FaClock className="h-4 w-4 mr-1 text-gray-400" />
              <span className={`font-medium ${getDeliveryTimeColor(restaurant.deliveryTime)}`}>
                {restaurant.deliveryTime} mins
              </span>
            </div>
            
            <div className="flex items-center">
              <FaMotorcycle className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-gray-600">
                ${restaurant.deliveryFee?.toFixed(2) || 'Free'}
              </span>
            </div>
          </div>
          
          {/* Minimum Order */}
          {restaurant.minimumOrder && (
            <div className="mt-2 text-xs text-gray-500">
              Min. order: ${restaurant.minimumOrder.toFixed(2)}
            </div>
          )}
          
          {/* Popular Items Preview */}
          {restaurant.popularItems && restaurant.popularItems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Popular:</p>
              <p className="text-sm text-gray-700 truncate">
                {restaurant.popularItems.slice(0, 3).join(', ')}
              </p>
            </div>
          )}
          
          {/* Offers */}
          {restaurant.offers && restaurant.offers.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {restaurant.offers.slice(0, 2).map((offer, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {offer}
                  </span>
                ))}
                {restaurant.offers.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{restaurant.offers.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;
