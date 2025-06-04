import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/grocery/ProductGrid';
import CategoryFilter from '../components/grocery/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { getAllProducts } from '../services/productService';

const GroceryPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 500],
    isOrganic: false,
    inStock: true,
    sort: 'newest'
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialFilters = { ...filters };
    
    if (queryParams.has('category')) initialFilters.category = queryParams.get('category');
    if (queryParams.has('search')) setSearchTerm(queryParams.get('search'));
    if (queryParams.has('minPrice') && queryParams.has('maxPrice')) {
      initialFilters.priceRange = [
        parseInt(queryParams.get('minPrice')),
        parseInt(queryParams.get('maxPrice'))
      ];
    }
    if (queryParams.has('isOrganic')) initialFilters.isOrganic = queryParams.get('isOrganic') === 'true';
    if (queryParams.has('inStock')) initialFilters.inStock = queryParams.get('inStock') === 'true';
    if (queryParams.has('sort')) initialFilters.sort = queryParams.get('sort');
    
    setFilters(initialFilters);
  }, [location.search]);

  // Fetch products and categories
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const queryParams = {
          ...filters,
          search: searchTerm
        };
        const data = await getAllProducts(queryParams);
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setError(null);
      } catch (err) {
        setError('Failed to load grocery products. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductsAndCategories();
    
    // Update URL with current filters
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.set('category', filters.category);
    if (searchTerm) queryParams.set('search', searchTerm);
    queryParams.set('minPrice', filters.priceRange[0]);
    queryParams.set('maxPrice', filters.priceRange[1]);
    queryParams.set('isOrganic', filters.isOrganic);
    queryParams.set('inStock', filters.inStock);
    queryParams.set('sort', filters.sort);
    
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
  }, [filters, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleCategoryClick = (category) => {
    setFilters({ ...filters, category });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 500],
      isOrganic: false,
      inStock: true,
      sort: 'newest'
    });
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Grocery Store</h1>
        <div className="text-sm text-gray-600">
          {products.length} products found
        </div>
      </div>
      
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for grocery items..."
          initialValue={searchTerm}
        />
      </div>
      
      {/* Featured Categories */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          {(filters.category || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-20"></div>
            ))
          ) : categories.length > 0 ? (
            categories.map(category => (
              <div 
                key={category._id || category.name}
                className={`cursor-pointer p-4 rounded-lg text-center transition-all ${
                  filters.category === category.name
                    ? 'bg-blue-100 border-blue-300 border'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.icon && <div className="text-3xl mb-2">{category.icon}</div>}
                <span className="font-medium text-sm">{category.name}</span>
                {category.count && (
                  <div className="text-xs text-gray-500 mt-1">
                    {category.count} items
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No categories available
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <div className="sticky top-6">
            <CategoryFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <Alert type="error" message={error} />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No grocery items found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Sort Options */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  Showing {products.length} products
                  {searchTerm && ` for "${searchTerm}"`}
                  {filters.category && ` in ${filters.category}`}
                </div>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryPage;

