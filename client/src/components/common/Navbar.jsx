import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
// import { logout } from '../../redux/slices/authSlice';
import SearchBar from './SearchBar';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();
  
  // const { isAuthenticated, user } = useSelector((state) => state.auth);
  // const { items: cartItems } = useSelector((state) => state.cart);
  // const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user, logout: contextLogout } = useContext(AuthContext);
const cartItems = []; // temporary
const wishlistItems = []; // temporary

const handleLogout = () => {
  contextLogout();
  navigate('/');
};
 const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);


  
  const categories = [
    { id: 1, name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
    { id: 2, name: 'Dairy & Eggs', slug: 'dairy-eggs' },
    { id: 3, name: 'Meat & Seafood', slug: 'meat-seafood' },
    { id: 4, name: 'Bakery', slug: 'bakery' },
    { id: 5, name: 'Pantry & Staples', slug: 'pantry-staples' },
    { id: 6, name: 'Beverages', slug: 'beverages' },
    { id: 7, name: 'Snacks', slug: 'snacks' },
    { id: 8, name: 'Organic', slug: 'organic' }
  ];
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      
      if (isCategoryMenuOpen && !event.target.closest('.category-menu-container')) {
        setIsCategoryMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isCategoryMenuOpen]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);
  
  // Add shadow to navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate('/');
  // };
  
  return (
    <header className={`bg-white ${isScrolled ? 'shadow-md' : ''} sticky top-0 z-30 transition-shadow duration-300`}>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="hidden md:block">
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/track-order" className="hover:text-gray-300">Track Order</Link>
            <Link to="/contact" className="hover:text-gray-300">Contact Us</Link>
            <Link to="/help" className="hover:text-gray-300">Help</Link>
          </div>
        </div>
      </div>
      
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="FreshMart" 
                className="h-10"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150x50?text=FreshMart';
                }}
              />
            </Link>
          </div>
          
          {/* Desktop Search */}
          <div className="hidden md:block flex-grow mx-8">
            <SearchBar />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="relative flex items-center text-gray-700 hover:text-blue-600">
              <FaHeart className="h-6 w-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-blue-600">
              <FaShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <FaUser className="h-6 w-6 mr-1" />
                <FaChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">Hello, {user.firstName || user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      {user.role === 'vendor' && (
                        <Link
                          to="/vendor/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Vendor Dashboard
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                                            <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <FaSignOutAlt className="mr-2" />
                          Sign Out
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Create Account
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link
                        to="/vendor/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Become a Vendor
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Search"
            >
              <FaSearch className="h-6 w-6" />
            </button>
            
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
              <FaShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden mt-4">
            <SearchBar />
          </div>
        )}
      </div>
      
      {/* Navigation Links */}
      <nav className="bg-gray-100 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center space-x-8 py-3">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            
            <div className="relative category-menu-container">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium focus:outline-none"
              >
                Categories
                <FaChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryMenuOpen && (
                <div className="absolute left-0 mt-3 w-56 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
                  >
                    View All Categories
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/deals" className="text-gray-700 hover:text-blue-600 font-medium">
              Deals
            </Link>
            
            <Link to="/new-arrivals" className="text-gray-700 hover:text-blue-600 font-medium">
              New Arrivals
            </Link>
            
            <Link to="/recipes" className="text-gray-700 hover:text-blue-600 font-medium">
              Recipes
            </Link>
            
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium">
              Blog
            </Link>
            
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About Us
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Home
            </Link>
            
            <div className="block px-3 py-2">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center w-full text-left rounded-md text-base font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                Categories
                <FaChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryMenuOpen && (
                <div className="mt-2 pl-4 space-y-1 border-l-2 border-gray-100">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    className="block py-2 text-sm font-medium text-blue-600"
                  >
                    View All Categories
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              to="/deals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Deals
            </Link>
            
            <Link
              to="/new-arrivals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              New Arrivals
            </Link>
            
            <Link
              to="/recipes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Recipes
            </Link>
            
            <Link
              to="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Blog
            </Link>
            
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              About Us
            </Link>
            
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="px-3 space-y-1">
                <Link
                  to="/wishlist"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <FaHeart className="mr-3 h-5 w-5" />
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-gray-500">
                      Hello, {user.firstName || user.username}
                    </div>
                    <Link
                      to="/account"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      My Orders
                    </Link>
                    {user.role === 'vendor' && (
                      <Link
                        to="/vendor/dashboard"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      <FaSignOutAlt className="mr-3 h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/vendor/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      Become a Vendor
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

