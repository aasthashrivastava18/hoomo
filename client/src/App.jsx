// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import { OrderProvider } from './context/OrderContext';

// // Layout Components
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';
// import PrivateRoute from './components/common/PrivateRoute';
// import NotFound from './components/common/NotFound';

// // Pages
// import Home from './pages/HomePage';
// import Login from './pages/LoginPage';
// import Register from './pages/RegisterPage';
// import VendorSignup from './pages/VendorSignupPage';
// import ProductDetail from './pages/ProductDetailPage';
// import Cart from './pages/CartPage';
// import Checkout from './pages/CheckoutPage';
// import Orders from './pages/OrderHistoryPage';
// import TrackOrder from './pages/TrackOrderPage';

// // Vendor Pages
// import VendorDashboard from "./components/vendor/VendorDashboard";
// import AddProduct from './components/vendor/AddProduct';

// // Admin Pages
// import AdminDashboard from './components/admin/AdminDashboard';

// // Styles
// import './App.css';

// function App() {
//   const dispatch = useDispatch();

//   // useEffect(() => {
//   //   // Initialize app data on mount
//   //   dispatch(checkAuthStatus());
//   //   dispatch(loadCartFromStorage());
//   //   dispatch(loadWishlistFromStorage());
//   // }, [dispatch]);

//   return (
//     <AuthProvider>
//       <CartProvider>
//         <OrderProvider>
//           <Router>
//             <div className="App min-h-screen flex flex-col">
//               {/* Toast Notifications */}
//               <Toaster
//                 position="top-right"
//                 toastOptions={{
//                   duration: 4000,
//                   style: {
//                     background: '#363636',
//                     color: '#fff',
//                   },
//                   success: {
//                     duration: 3000,
//                     theme: {
//                       primary: 'green',
//                       secondary: 'black',
//                     },
//                   },
//                   error: {
//                     duration: 5000,
//                     theme: {
//                       primary: 'red',
//                       secondary: 'black',
//                     },
//                   },
//                 }}
//               />

//               {/* Navigation */}
//               <Navbar />

//               {/* Main Content */}
//               <main className="flex-grow">
//                 <Routes>
//                   {/* Public Routes */}
//                   <Route path="/" element={<Home />} />
//                   <Route path="/login" element={<Login />} />
//                   <Route path="/register" element={<Register />} />
//                   <Route path="/vendor/signup" element={<VendorSignup />} />
//                   <Route path="/product/:id" element={<ProductDetail />} />
//                   <Route path="/track-order" element={<TrackOrder />} />

//                   {/* Protected Routes - Require Authentication */}
//                   <Route
//                     path="/cart"
//                     element={
//                       <PrivateRoute>
//                         <Cart />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/checkout"
//                     element={
//                       <PrivateRoute>
//                         <Checkout />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/orders"
//                     element={
//                       <PrivateRoute>
//                         <Orders />
//                       </PrivateRoute>
//                     }
//                   />

//                   {/* Vendor Routes - Require Vendor Role */}
//                   <Route
//                     path="/vendor/dashboard"
//                     element={
//                       <PrivateRoute requiredRole="vendor">
//                         <VendorDashboard />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/vendor/products/add"
//                     element={
//                       <PrivateRoute requiredRole="vendor">
//                         <AddProduct />
//                       </PrivateRoute>
//                     }
//                   />

//                   {/* Admin Routes - Require Admin Role */}
//                   <Route
//                     path="/admin/dashboard"
//                     element={
//                       <PrivateRoute requiredRole="admin">
//                         <AdminDashboard />
//                       </PrivateRoute>
//                     }
//                   />

//                   {/* 404 Not Found */}
//                   <Route path="*" element={<NotFound />} />
//                 </Routes>
//               </main>

//               {/* Footer */}
//               <Footer />
//             </div>
//           </Router>
//         </OrderProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import { OrderProvider } from './context/OrderContext';

// // Layout Components
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';
// import PrivateRoute from './components/common/PrivateRoute';
// import NotFound from './components/common/NotFound';

// // Pages
// import Home from './pages/HomePage';
// import Login from './pages/LoginPage';
// import Register from './pages/RegisterPage';
// import VendorSignup from './pages/VendorSignupPage';
// import ProductDetail from './pages/ProductDetailPage';
// import Cart from './pages/CartPage';
// import Checkout from './pages/CheckoutPage';
// import Orders from './pages/OrderHistoryPage';
// import TrackOrder from './pages/TrackOrderPage';

// // Vendor Pages
// import VendorDashboard from "./components/vendor/VendorDashboard";
// import AddProduct from './components/vendor/AddProduct';

// // Admin Pages
// import AdminDashboard from './components/admin/AdminDashboard';

// // OPTIONAL: Uncomment when these components/pages are ready
// // import { checkAuthStatus } from './redux/slices/authSlice';
// // import { loadCartFromStorage } from './redux/slices/cartSlice';
// // import { loadWishlistFromStorage } from './redux/slices/wishlistSlice';

// // import other optional pages/components here...

// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
// import { OrderProvider } from './context/OrderContext';

// // Layout Components
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';
// import PrivateRoute from './components/common/PrivateRoute';
// import NotFound from './components/common/NotFound';

// // Pages
// import Home from './pages/HomePage';
// import Login from './pages/LoginPage';
// import Register from './pages/RegisterPage';
// import VendorSignup from './pages/VendorSignupPage';
// import ProductDetail from './pages/ProductDetailPage';
// import Cart from './pages/CartPage';
// import Checkout from './pages/CheckoutPage';
// import Orders from './pages/OrderHistoryPage';
// import TrackOrder from './pages/TrackOrderPage';

// // Vendor Pages
// import VendorDashboard from "./components/vendor/VendorDashboard";
// import AddProduct from './components/vendor/AddProduct';

// // Admin Pages
// import AdminDashboard from './components/admin/AdminDashboard';

// // OPTIONAL: Uncomment when these components/pages are ready
// // import { checkAuthStatus } from './redux/slices/authSlice';
// // import { loadCartFromStorage } from './redux/slices/cartSlice';
// // import { loadWishlistFromStorage } from './redux/slices/wishlistSlice';

// // import other optional pages/components here...

// import './App.css';

// function App() {
//   const dispatch = useDispatch();

//   // useEffect(() => {
//   //   dispatch(checkAuthStatus());
//   //   dispatch(loadCartFromStorage());
//   //   dispatch(loadWishlistFromStorage());
//   // }, [dispatch]);

//   return (
//     <AuthProvider>
//       <CartProvider>
//         <OrderProvider>
//           <Router>
//             <div className="App min-h-screen flex flex-col">
//               {/* Toast Notifications */}
//               <Toaster
//                 position="top-right"
//                 toastOptions={{
//                   duration: 4000,
//                   style: { background: '#363636', color: '#fff' },
//                   success: { duration: 3000, theme: { primary: 'green', secondary: 'black' } },
//                   error: { duration: 5000, theme: { primary: 'red', secondary: 'black' } },
//                 }}
//               />

//               {/* Navbar */}
//               <Navbar />

//               {/* Routes */}
//               <main className="flex-grow">
//                 <Routes>
//                   {/* Public Routes */}
//                   <Route path="/" element={<Home />} />
//                   <Route path="/login" element={<Login />} />
//                   <Route path="/register" element={<Register />} />
//                   <Route path="/vendor/signup" element={<VendorSignup />} />
//                   <Route path="/product/:id" element={<ProductDetail />} />
//                   <Route path="/track-order" element={<TrackOrder />} />

//                   {/* Protected Routes */}
//                   <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
//                   <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
//                   <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />

//                   {/* Vendor Routes */}
//                   <Route path="/vendor/dashboard" element={<PrivateRoute requiredRole="vendor"><VendorDashboard /></PrivateRoute>} />
//                   <Route path="/vendor/products/add" element={<PrivateRoute requiredRole="vendor"><AddProduct /></PrivateRoute>} />

//                   {/* Admin Routes */}
//                   <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />

//                   {/* 404 Not Found */}
//                   <Route path="*" element={<NotFound />} />
//                 </Routes>
//               </main>

//               {/* Footer */}
//               <Footer />
//             </div>
//           </Router>
//         </OrderProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import NotFound from './components/common/NotFound';

// Pages
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import VendorSignup from './pages/VendorSignupPage';
import ProductDetail from './pages/ProductDetailPage';
import Cart from './pages/CartPage';
import Checkout from './pages/CheckoutPage';
import Orders from './pages/OrderHistoryPage';
import TrackOrder from './pages/TrackOrderPage';

// Vendor Pages
import VendorDashboard from "./components/vendor/VendorDashboard";
import AddProduct from './components/vendor/AddProduct';

// Admin Pages
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <div className="App min-h-screen flex flex-col">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: 'green',
                      secondary: 'black',
                    },
                  },
                  error: {
                    duration: 5000,
                    theme: {
                      primary: 'red',
                      secondary: 'black',
                    },
                  },
                }}
              />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/vendor/signup" element={<VendorSignup />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <Orders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/vendor/dashboard"
                    element={
                      <PrivateRoute requiredRole="vendor">
                        <VendorDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/vendor/products/add"
                    element={
                      <PrivateRoute requiredRole="vendor">
                        <AddProduct />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <PrivateRoute requiredRole="admin">
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

