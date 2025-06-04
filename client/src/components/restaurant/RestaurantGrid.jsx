import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSort, FaMapMarkerAlt, FaSearch, FaTimes } from 'react-icons/fa';
import RestaurantCard from './RestaurantCard';
import Loader from './common/Loader';
// import Pagination from './common/Pagination';

const RestaurantGrid = ({ 
  restaurants = [], 
  loading = false, 
  showFilters = true,
  showSearch = true,
  showSort = true,
  itemsPerPage = 12,
  className = ''
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter and search states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    rating: searchParams.get('rating') || '',
    deliveryTime: searchParams.get('deliveryTime') || '',
    priceRange: searchParams.get('priceRange') || '',
    deliveryFee: searchParams.get('deliveryFee') || '',
    isOpen: searchParams.get('isOpen') === 'true',
    location: searchParams.get('location') || ''
  });
  
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  
  // Available filter options
  const cuisineTypes = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'Thai', 
    'American', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Greek'
  ];
  
  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'deliveryFee', label: 'Delivery Fee' },
    { value: 'name', label: 'Name' },
    { value: 'reviewCount', label: 'Popularity' }
  ];
  
  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, value.toString());
      }
    });
    
    if (sortBy !== 'rating') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    
    setSearchParams(params);
  }, [filters, sortBy, sortOrder, setSearchParams]);
  
  // Filter and sort restaurants
  useEffect(() => {
    let filtered = [...restaurants];
    
    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        restaurant.cuisineTypes?.some(cuisine => 
          cuisine.toLowerCase().includes(filters.search.toLowerCase())
        ) ||
        restaurant.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.cuisine) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisineTypes?.includes(filters.cuisine)
      );
    }
    
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(restaurant => restaurant.rating >= minRating);
    }
    
    if (filters.deliveryTime) {
      const maxTime = parseInt(filters.deliveryTime);
      filtered = filtered.filter(restaurant => restaurant.deliveryTime <= maxTime);
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(restaurant => {
        const avgPrice = restaurant.averagePrice || 20; // Default average price
        switch (filters.priceRange) {
          case 'budget':
            return avgPrice < 15;
          case 'mid':
            return avgPrice >= 15 && avgPrice <= 30;
          case 'premium':
            return avgPrice > 30;
          default:
            return true;
        }
      });
    }
    
    if (filters.deliveryFee) {
      if (filters.deliveryFee === 'free') {
        filtered = filtered.filter(restaurant => restaurant.deliveryFee === 0);
      } else {
        const maxFee = parseFloat(filters.deliveryFee);
        filtered = filtered.filter(restaurant => restaurant.deliveryFee <= maxFee);
      }
    }
    
    if (filters.isOpen) {
      filtered = filtered.filter(restaurant => restaurant.isOpen);
    }
    
    if (filters.location) {
      filtered = filtered.filter(restaurant =>
        restaurant.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle special cases
      if (sortBy === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredRestaurants(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [restaurants, filters, sortBy, sortOrder]);
  
  // Pagination
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      rating: '',
      deliveryTime: '',
      priceRange: '',
      deliveryFee: '',
      isOpen: false,
      location: ''
    });
    setSortBy('rating');
    setSortOrder('desc');
  };
  
  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== false
  ).length;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filter Bar */}
      {(showSearch || showFilters || showSort) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            {showSearch && (
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search restaurants, cuisines, or locations..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {filters.search && (
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Open Now Filter */}
              <button
                onClick={() => handleFilterChange('isOpen', !filters.isOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.isOpen
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Open Now
              </button>
              
              {/* Free Delivery Filter */}
              <button
                onClick={() => handleFilterChange('deliveryFee', filters.deliveryFee === 'free' ? '' : 'free')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.deliveryFee === 'free'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Free Delivery
              </button>
              
              {/* More Filters Button */}
              {showFilters && (
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaFilter className="h-4 w-4 mr-1" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              )}
              
              {/* Sort Dropdown */}
              {showSort && (
                <div className="flex items-center">
                  <FaSort className="h-4 w-4 text-gray-400 mr-2" />
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <React.Fragment key={option.value}>
                        <option value={`${option.value}-desc`}>
                          {option.label} (High to Low)
                        </option>
                        <option value={`${option.value}-asc`}>
                          {option.label} (Low to High)
                        </option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          
          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || value === '' || value === false) return null;
                    
                    let displayValue = value;
                    if (key === 'isOpen') displayValue = 'Open Now';
                    if (key === 'deliveryFee' && value === 'free') displayValue = 'Free Delivery';
                    
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {displayValue}
                        <button
                          onClick={() => handleFilterChange(key, key === 'isOpen' ? false : '')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRestaurants.length)} of {filteredRestaurants.length} restaurants
        </p>
      </div>
      
      {/* Restaurant Grid */}
      {paginatedRestaurants.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                className="h-full"
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaMapMarkerAlt className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No restaurants found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
          {/* Advanced Filters Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowFilterModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Cuisine Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type
                    </label>
                    <select
                      value={filters.cuisine}
                      onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Cuisines</option>
                      {cuisineTypes.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>
                  
                  {/* Delivery Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Delivery Time
                    </label>
                    <select
                      value={filters.deliveryTime}
                      onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Time</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Price</option>
                      <option value="budget">Budget (Under $15)</option>
                      <option value="mid">Mid-range ($15-$30)</option>
                      <option value="premium">Premium ($30+)</option>
                    </select>
                  </div>
                  
                  {/* Delivery Fee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee
                    </label>
                    <select
                      value={filters.deliveryFee}
                      onChange={(e) => handleFilterChange('deliveryFee', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Fee</option>
                      <option value="free">Free Delivery</option>
                      <option value="2">Under $2</option>
                      <option value="5">Under $5</option>
                    </select>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Enter area or neighborhood"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Open Now Toggle */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.isOpen}
                        onChange={(e) => handleFilterChange('isOpen', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Show only open restaurants
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    clearFilters();
                    setShowFilterModal(false);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantGrid;

        
