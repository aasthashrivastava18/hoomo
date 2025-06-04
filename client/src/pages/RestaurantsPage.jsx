// import React, { useEffect, useState } from 'react';
// import Loader from '../components/common/Loader';
// import RestaurantCard from '../components/restaurant/RestaurantCard';
// import { getAllRestaurants } from '../services/restaurantService';

// const RestaurantsPage = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const data = await getAllRestaurants();
//         setRestaurants(data);
//       } catch (err) {
//         setError('Failed to load restaurants.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurants();
//   }, []);

//   if (loading) return <Loader />;
//   if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
//   if (restaurants.length === 0) return <div className="text-center mt-8">No restaurants found.</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Restaurants Near You</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {restaurants.map(restaurant => (
//           <RestaurantCard key={restaurant._id} restaurant={restaurant} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RestaurantsPage;
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaStar, FaClock, FaUtensils, FaSort, FaExclamationTriangle, FaLocationArrow } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Breadcrumb from '../components/common/Breadcrumb';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { getAllRestaurants } from '../services/restaurantService';

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || 'all',
    rating: searchParams.get('rating') || 'all',
    priceRange: searchParams.get('priceRange') || 'all',
    deliveryTime: searchParams.get('deliveryTime') || 'all',
    sortBy: searchParams.get('sortBy') || 'rating',
    location: searchParams.get('location') || ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllRestaurants();
        setRestaurants(data || []);
      } catch (err) {
        console.error('Error loading restaurants:', err);
        setError(err.message || 'Failed to load restaurants. Please try again.');
        toast.error('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Get user location
  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        toast.success('Location detected successfully!');
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to get your location');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Filter and sort restaurants
  const processedRestaurants = useMemo(() => {
    let filtered = [...restaurants];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.name?.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine?.toLowerCase().includes(searchTerm) ||
        restaurant.description?.toLowerCase().includes(searchTerm) ||
        restaurant.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Cuisine filter
    if (filters.cuisine !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine?.toLowerCase() === filters.cuisine.toLowerCase()
      );
    }

    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(restaurant => 
        (restaurant.rating || 0) >= minRating
      );
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.priceRange === filters.priceRange
      );
    }

    // Delivery time filter
    if (filters.deliveryTime !== 'all') {
      const maxTime = parseInt(filters.deliveryTime);
      filtered = filtered.filter(restaurant => 
        (restaurant.deliveryTime || 60) <= maxTime
      );
    }

    // Location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.location?.toLowerCase().includes(locationTerm) ||
        restaurant.address?.toLowerCase().includes(locationTerm)
      );
    }

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'deliveryTime':
          return (a.deliveryTime || 60) - (b.deliveryTime || 60);
        case 'distance':
          if (userLocation && a.coordinates && b.coordinates) {
            const distanceA = calculateDistance(userLocation, a.coordinates);
            const distanceB = calculateDistance(userLocation, b.coordinates);
            return distanceA - distanceB;
          }
          return 0;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    return filtered;
  }, [restaurants, filters, userLocation]);

  // Calculate distance between two coordinates
  const calculateDistance = (pos1, pos2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      cuisine: 'all',
      rating: 'all',
      priceRange: 'all',
      deliveryTime: 'all',
      sortBy: 'rating',
      location: ''
    });
  };

  const getUniqueCuisines = () => {
    const cuisines = restaurants
      .map(r => r.cuisine)
      .filter(Boolean)
      .filter((cuisine, index, arr) => arr.indexOf(cuisine) === index);
    return cuisines.sort();
  };

  const handleRetry = () => {
    setError('');
    window.location.reload();
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Restaurants', path: '/restaurants', current: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600">Finding the best restaurants for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <FaExclamationTriangle className="mx-auto text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to Load Restaurants
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <FaUtensils className="inline mr-3" />
                Restaurants Near You
              </h1>
              <p className="text-gray-600">
                Discover amazing food from {restaurants.length} restaurants
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <button
                onClick={getUserLocation}
                disabled={locationLoading}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {locationLoading ? (
                  <Loader size="sm" color="white" />
                ) : (
                  <FaLocationArrow className="mr-2" />
                )}
                {userLocation ? 'Update Location' : 'Get My Location'}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or locations..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {processedRestaurants.length} restaurants found
              </span>
              
              {(filters.search || filters.cuisine !== 'all' || filters.rating !== 'all' || 
                filters.priceRange !== 'all' || filters.deliveryTime !== 'all' || filters.location) && (
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-4 border-t border-gray-200">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine
                </label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Cuisines</option>
                  {getUniqueCuisines().map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                                    value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="$">$ - Budget</option>
                  <option value="$$">$$ - Moderate</option>
                  <option value="$$$">$$$ - Expensive</option>
                  <option value="$$$$">$$$$ - Fine Dining</option>
                </select>
              </div>

              {/* Delivery Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time
                </label>
                <select
                  value={filters.deliveryTime}
                  onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Any Time</option>
                  <option value="30">Under 30 min</option>
                  <option value="45">Under 45 min</option>
                  <option value="60">Under 1 hour</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                  <option value="deliveryTime">Fastest Delivery</option>
                  <option value="newest">Newest</option>
                  {userLocation && <option value="distance">Nearest</option>}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(filters.search || filters.cuisine !== 'all' || filters.rating !== 'all' || 
          filters.priceRange !== 'all' || filters.deliveryTime !== 'all' || filters.location) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.location && (
                <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Location: {filters.location}
                  <button
                    onClick={() => handleFilterChange('location', '')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.cuisine !== 'all' && (
                <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Cuisine: {filters.cuisine}
                  <button
                    onClick={() => handleFilterChange('cuisine', 'all')}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.rating !== 'all' && (
                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Rating: {filters.rating}+ stars
                  <button
                    onClick={() => handleFilterChange('rating', 'all')}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.priceRange !== 'all' && (
                <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  Price: {filters.priceRange}
                  <button
                    onClick={() => handleFilterChange('priceRange', 'all')}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.deliveryTime !== 'all' && (
                <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  Delivery: Under {filters.deliveryTime} min
                  <button
                    onClick={() => handleFilterChange('deliveryTime', 'all')}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {processedRestaurants.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {processedRestaurants.length} Restaurant{processedRestaurants.length !== 1 ? 's' : ''} Found
                </h2>
                
                {userLocation && (
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                    📍 Location detected
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <FaSort className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Sorted by: {filters.sortBy === 'rating' ? 'Highest Rated' : 
                            filters.sortBy === 'name' ? 'Name A-Z' :
                            filters.sortBy === 'deliveryTime' ? 'Fastest Delivery' :
                            filters.sortBy === 'distance' ? 'Nearest' : 'Newest'}
                </span>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant._id} 
                  restaurant={restaurant}
                  userLocation={userLocation}
                  showDistance={userLocation && restaurant.coordinates}
                />
              ))}
            </div>

            {/* Load More Button (if needed for pagination) */}
            {restaurants.length > 20 && processedRestaurants.length >= 20 && (
              <div className="text-center mt-12">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Load More Restaurants
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <FaUtensils className="mx-auto text-6xl text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No Restaurants Found
              </h3>
              <p className="text-gray-600 mb-6">
                {restaurants.length === 0 
                  ? "We couldn't find any restaurants in your area. Please try again later."
                  : "No restaurants match your current filters. Try adjusting your search criteria."
                }
              </p>
              
              <div className="space-y-3">
                {restaurants.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
                
                {!userLocation && (
                  <button
                    onClick={getUserLocation}
                    disabled={locationLoading}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {locationLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader size="sm" color="white" />
                        <span className="ml-2">Getting Location...</span>
                      </div>
                    ) : (
                      <>
                        <FaLocationArrow className="inline mr-2" />
                        Find Restaurants Near Me
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Popular Cuisines Section */}
        {restaurants.length > 0 && (
          <div className="mt-16 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Cuisines</h3>
            <div className="flex flex-wrap gap-3">
              {getUniqueCuisines().slice(0, 8).map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => handleFilterChange('cuisine', cuisine)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    filters.cuisine === cuisine
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {restaurants.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{restaurants.length}</div>
              <div className="text-sm text-gray-600">Total Restaurants</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getUniqueCuisines().length}</div>
              <div className="text-sm text-gray-600">Cuisines Available</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {restaurants.filter(r => (r.rating || 0) >= 4.0).length}
              </div>
              <div className="text-sm text-gray-600">Highly Rated (4.0+)</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {restaurants.filter(r => (r.deliveryTime || 60) <= 30).length}
              </div>
              <div className="text-sm text-gray-600">Fast Delivery (≤30min)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
