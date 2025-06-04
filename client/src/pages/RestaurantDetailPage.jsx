// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Loader from '../components/common/Loader';
// import RestaurantDetail from '../components/restaurant/RestaurantDetail';
// import MenuCard from '../components/restaurant/MenuCard';
// import { getRestaurantById } from '../services/restaurantService';

// const RestaurantDetailPage = () => {
//   const { id } = useParams();
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       try {
//         const data = await getRestaurantById(id);
//         setRestaurant(data);
//       } catch (err) {
//         setError('Failed to load restaurant details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurant();
//   }, [id]);

//   if (loading) return <Loader />;
//   if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
//   if (!restaurant) return <div className="text-center mt-8">No restaurant found.</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       <RestaurantDetail restaurant={restaurant} />
//       <h2 className="text-2xl font-semibold mt-8 mb-4">Menu</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {restaurant.menu && restaurant.menu.length > 0 ? (
//           restaurant.menu.map(menuItem => (
//             <MenuCard key={menuItem._id} menu={menuItem} />
//           ))
//         ) : (
//           <p>No menu items available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RestaurantDetailPage;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle, FaUtensils, FaFilter, FaSearch, FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Breadcrumb from '../components/common/Breadcrumb';
import RestaurantDetail from '../components/restaurant/RestaurantDetail';
import MenuCard from '../components/restaurant/MenuCard';
import { getRestaurantById } from '../services/restaurantService';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    searchTerm: '',
    sortBy: 'name'
  });

  useEffect(() => {
    if (!id) {
      setError('Invalid restaurant ID');
      setLoading(false);
      return;
    }

    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getRestaurantById(id);
        setRestaurant(data);
        setFilteredMenu(data?.menu || []);
      } catch (err) {
        console.error('Error loading restaurant:', err);
        setError(err.message || 'Failed to load restaurant details. Please try again.');
        toast.error('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Filter and sort menu items
  useEffect(() => {
    if (!restaurant?.menu) return;

    let filtered = [...restaurant.menu];

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        const price = item.price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredMenu(filtered);
  }, [restaurant, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      searchTerm: '',
      sortBy: 'name'
    });
  };

  const getMenuCategories = () => {
    if (!restaurant?.menu) return [];
    const categories = [...new Set(restaurant.menu.map(item => item.category))];
    return categories.filter(Boolean);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    window.location.reload();
  };

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Restaurants', path: '/restaurants' }
    ];

    if (restaurant?.name) {
      items.push({
        label: restaurant.name,
        path: `/restaurant/${id}`,
        current: true
      });
    }

    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600">Loading restaurant details...</p>
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
              Unable to Load Restaurant
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
                onClick={handleGoBack}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaArrowLeft className="inline mr-2" />
                Go Back
              </button>
              
              <Link
                to="/restaurants"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center"
              >
                <FaUtensils className="inline mr-2" />
                Browse Restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-6xl mb-4">🔍❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Restaurant Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The restaurant you're looking for doesn't exist or may have been removed.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleGoBack}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaArrowLeft className="inline mr-2" />
                Go Back
              </button>
              
              <Link
                to="/restaurants"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Browse All Restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = getMenuCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Restaurants
          </button>
        </div>

        {/* Restaurant Detail */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <RestaurantDetail restaurant={restaurant} />
        </div>

        {/* Restaurant Quick Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <FaStar className="text-yellow-500 mr-2" />
              <span className="font-semibold">{restaurant.rating || 'N/A'}</span>
              <span className="text-gray-600 ml-1">
                ({restaurant.reviewCount || 0} reviews)
              </span>
            </div>
            
            <div className="flex items-center">
              <FaClock className="text-blue-500 mr-2" />
              <span className="text-gray-700">
                {restaurant.deliveryTime || '30-45'} mins delivery
              </span>
            </div>
            
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <span className="text-gray-700">
                {restaurant.distance || '2.5'} km away
              </span>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              <FaUtensils className="inline mr-2" />
              Menu
            </h2>
            <span className="text-gray-600">
              {filteredMenu.length} items
            </span>
          </div>

          {/* Menu Filters */}
          {restaurant.menu && restaurant.menu.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Price Range Filter */}
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-10">$0 - $10</option>
                    <option value="10-20">$10 - $20</option>
                    <option value="20-30">$20 - $30</option>
                    <option value="30">$30+</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(filters.category !== 'all' || filters.priceRange !== 'all' || filters.searchTerm || filters.sortBy !== 'name') && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Menu Items */}
          {restaurant.menu && restaurant.menu.length > 0 ? (
            filteredMenu.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map(menuItem => (
                  <MenuCard 
                    key={menuItem._id} 
                    menu={menuItem} 
                    restaurantId={restaurant._id}
                    restaurantName={restaurant.name}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaFilter className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Items Found
                </h3>
                <p className="text-gray-600 mb-4">
                  No menu items match your current filters.
                </p>
                                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <FaUtensils className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Menu Available
              </h3>
              <p className="text-gray-600 mb-4">
                This restaurant hasn't uploaded their menu yet.
              </p>
              <Link
                to="/restaurants"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                Browse Other Restaurants
              </Link>
            </div>
          )}
        </div>

        {/* Restaurant Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/restaurants"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            <FaUtensils className="inline mr-2" />
            Browse More Restaurants
          </Link>
          
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors text-center"
            >
              📞 Call Restaurant
            </a>
          )}
          
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              🌐 Visit Website
            </a>
          )}
        </div>

        {/* Additional Restaurant Info */}
        {(restaurant.description || restaurant.specialties || restaurant.openingHours) && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About This Restaurant</h3>
            
            {restaurant.description && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{restaurant.description}</p>
              </div>
            )}
            
            {restaurant.specialties && restaurant.specialties.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {restaurant.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {restaurant.openingHours && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Opening Hours</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}:</span>
                      <span className="text-gray-700">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {restaurant.amenities && restaurant.amenities.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {restaurant.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section Preview */}
        {restaurant.recentReviews && restaurant.recentReviews.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recent Reviews</h3>
              <Link
                to={`/restaurant/${id}/reviews`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Reviews
              </Link>
            </div>
            
            <div className="space-y-4">
              {restaurant.recentReviews.slice(0, 3).map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review.userName?.charAt(0) || 'U'}
                      </div>
                      <span className="ml-2 font-medium">{review.userName || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                  {review.date && (
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Restaurants */}
        {restaurant.similarRestaurants && restaurant.similarRestaurants.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Restaurants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurant.similarRestaurants.map((similar) => (
                <Link
                  key={similar._id}
                  to={`/restaurant/${similar._id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    {similar.image ? (
                      <img
                        src={similar.image}
                        alt={similar.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FaUtensils className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{similar.name}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span>{similar.rating || 'N/A'}</span>
                        <span className="mx-2">•</span>
                        <span>{similar.cuisine || 'Restaurant'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
