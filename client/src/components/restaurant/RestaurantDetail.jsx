import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock, 
  FaMotorcycle, 
  FaPhone, 
  FaHeart, 
  FaRegHeart,
  FaShare,
  FaFilter,
  FaSearch,
  FaLeaf,
  FaFire,
  FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import MenuCard from './MenuCard';
import Loader from './common/Loader';
import Modal from './common/Modal';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    spicy: false,
    priceRange: 'all'
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const isInWishlist = wishlistItems.some(item => 
    item.id === restaurant?.id && item.type === 'restaurant'
  );
  
  // Mock data - replace with API call
  useEffect(() => {
    const fetchRestaurantData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRestaurant = {
          id: parseInt(id),
          name: "Bella Italia",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
          rating: 4.5,
          reviewCount: 1250,
          cuisineTypes: ["Italian", "Mediterranean"],
          address: "123 Main Street, Downtown",
          phone: "+1 (555) 123-4567",
          deliveryTime: 35,
          deliveryFee: 2.99,
          minimumOrder: 15.00,
          isOpen: true,
          openingHours: {
            monday: "11:00 AM - 10:00 PM",
            tuesday: "11:00 AM - 10:00 PM",
            wednesday: "11:00 AM - 10:00 PM",
            thursday: "11:00 AM - 10:00 PM",
            friday: "11:00 AM - 11:00 PM",
            saturday: "11:00 AM - 11:00 PM",
            sunday: "12:00 PM - 9:00 PM"
          },
          description: "Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations.",
          offers: ["Free delivery on orders over $30", "20% off first order"],
          categories: [
            { id: 'appetizers', name: 'Appetizers', count: 8 },
            { id: 'pasta', name: 'Pasta', count: 12 },
            { id: 'pizza', name: 'Pizza', count: 15 },
            { id: 'mains', name: 'Main Courses', count: 10 },
            { id: 'desserts', name: 'Desserts', count: 6 }
          ]
        };
        
        const mockMenuItems = [
          {
            id: 1,
            name: "Margherita Pizza",
            description: "Fresh tomato sauce, mozzarella cheese, and basil on our signature thin crust",
            price: 16.99,
            originalPrice: 18.99,
            image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300",
            category: 'pizza',
            isVegetarian: true,
            rating: 4.6,
            reviewCount: 89,
            prepTime: 15,
            badges: [{ type: 'bestseller', label: 'Bestseller' }],
            variants: [
              { id: 1, name: 'Small (10")', price: 16.99 },
              { id: 2, name: 'Medium (12")', price: 19.99 },
              { id: 3, name: 'Large (14")', price: 22.99 }
            ],
            addons: [
              { id: 1, name: 'Extra Cheese', price: 2.50 },
              { id: 2, name: 'Mushrooms', price: 1.50 },
              { id: 3, name: 'Pepperoni', price: 2.00 }
            ]
          },
          {
            id: 2,
            name: "Spaghetti Carbonara",
            description: "Classic Roman pasta with eggs, cheese, pancetta, and black pepper",
            price: 18.99,
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300",
            category: 'pasta',
            rating: 4.7,
            reviewCount: 156,
            prepTime: 20,
            badges: [{ type: 'new', label: 'New' }]
          },
          {
            id: 3,
            name: "Bruschetta Trio",
            description: "Three varieties of our famous bruschetta with fresh toppings",
            price: 12.99,
            image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300",
            category: 'appetizers',
            isVegetarian: true,
            rating: 4.4,
            reviewCount: 67,
            prepTime: 10
          },
          {
            id: 4,
            name: "Spicy Arrabbiata",
            description: "Penne pasta in a fiery tomato sauce with garlic and red chilies",
            price: 17.99,
            image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300",
            category: 'pasta',
            isVegetarian: true,
            isSpicy: true,
            rating: 4.3,
            reviewCount: 92,
            prepTime: 18,
            badges: [{ type: 'spicy', label: 'Spicy' }]
          },
          {
            id: 5,
            name: "Tiramisu",
            description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
            price: 8.99,
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300",
            category: 'desserts',
            isVegetarian: true,
            rating: 4.8,
            reviewCount: 134,
            prepTime: 5
          }
        ];
        
        setRestaurant(mockRestaurant);
        setMenuItems(mockMenuItems);
      } catch (error) {
        toast.error('Failed to load restaurant details');
        navigate('/restaurants');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [id, navigate]);
  
  const handleWishlistToggle = () => {
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
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Check out ${restaurant.name} on FreshMart`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  const filteredMenuItems = menuItems.filter(item => {
    // Category filter
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Dietary filters
    if (filters.vegetarian && !item.isVegetarian) {
      return false;
    }
    
    if (filters.vegan && !item.isVegan) {
      return false;
    }
    
    if (filters.spicy && !item.isSpicy) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      const price = item.price;
      switch (filters.priceRange) {
        case 'under-15':
          if (price >= 15) return false;
          break;
        case '15-25':
          if (price < 15 || price > 25) return false;
          break;
        case 'over-25':
          if (price <= 25) return false;
          break;
        default:
          break;
      }
    }
    
    return true;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Restaurant not found</h2>
        <button
          onClick={() => navigate('/restaurants')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-lg mb-2">
                  {restaurant.cuisineTypes.join(' • ')}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <FaStar className="h-4 w-4 mr-1" />
                    <span>{restaurant.rating}</span>
                    <span className="ml-1">({restaurant.reviewCount})</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="h-4 w-4 mr-1" />
                    <span>{restaurant.deliveryTime} mins</span>
                  </div>
                  <div className="flex items-center">
                    <FaMotorcycle className="h-4 w-4 mr-1" />
                    <span>${restaurant.deliveryFee}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleWishlistToggle}
                  className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  {isInWishlist ? (
                    <FaHeart className="h-6 w-6 text-red-500" />
                  ) : (
                    <FaRegHeart className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <FaShare className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setShowInfoModal(true)}
                  className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <FaInfoCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant Info Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span>{restaurant.isOpen ? 'Open' : 'Closed'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Min. order: ${restaurant.minimumOrder}
              </span>
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                                <FaPhone className="h-4 w-4 mr-2" />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Offers Banner */}
      {restaurant.offers && restaurant.offers.length > 0 && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-4 overflow-x-auto">
              {restaurant.offers.map((offer, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {offer}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Menu Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories and Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-32">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Items ({menuItems.length})
                  </button>
                  {restaurant.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filters */}
              <div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 mb-3"
                >
                  <span>Filters</span>
                  <FaFilter className="h-4 w-4" />
                </button>
                
                {showFilters && (
                  <div className="space-y-4">
                    {/* Dietary Filters */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Dietary</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.vegetarian}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              vegetarian: e.target.checked
                            }))}
                            className="mr-2"
                          />
                          <FaLeaf className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm">Vegetarian</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.vegan}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              vegan: e.target.checked
                            }))}
                            className="mr-2"
                          />
                          <FaLeaf className="h-4 w-4 text-green-700 mr-1" />
                          <span className="text-sm">Vegan</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.spicy}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              spicy: e.target.checked
                            }))}
                            className="mr-2"
                          />
                          <FaFire className="h-4 w-4 text-red-600 mr-1" />
                          <span className="text-sm">Spicy</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                      <div className="space-y-2">
                        {[
                          { value: 'all', label: 'All Prices' },
                          { value: 'under-15', label: 'Under $15' },
                          { value: '15-25', label: '$15 - $25' },
                          { value: 'over-25', label: 'Over $25' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              name="priceRange"
                              value={option.value}
                              checked={filters.priceRange === option.value}
                              onChange={(e) => setFilters(prev => ({
                                ...prev,
                                priceRange: e.target.value
                              }))}
                              className="mr-2"
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setFilters({
                          vegetarian: false,
                          vegan: false,
                          spicy: false,
                          priceRange: 'all'
                        });
                        setSearchTerm('');
                        setActiveCategory('all');
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="lg:w-3/4">
            {filteredMenuItems.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeCategory === 'all' 
                      ? 'All Items' 
                      : restaurant.categories.find(cat => cat.id === activeCategory)?.name
                    }
                  </h2>
                  <span className="text-gray-600">
                    {filteredMenuItems.length} item{filteredMenuItems.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {filteredMenuItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    restaurantId={restaurant.id}
                    className="mb-4"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FaSearch className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      vegetarian: false,
                      vegan: false,
                      spicy: false,
                      priceRange: 'all'
                    });
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Restaurant Info Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Restaurant Information"
        size="md"
      >
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-gray-600">{restaurant.description}</p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                  {restaurant.phone}
                </a>
              </div>
            </div>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Opening Hours</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize font-medium">{day}:</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delivery Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Delivery Time:</span>
                <span className="text-gray-600">{restaurant.deliveryTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="text-gray-600">${restaurant.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Order:</span>
                <span className="text-gray-600">${restaurant.minimumOrder}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RestaurantDetail;

