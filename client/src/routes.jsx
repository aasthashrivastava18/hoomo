import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import Layout from '../components/layout/Layout';
// import ProtectedRoute from '../components/auth/ProtectedRoute';
// import AdminRoute from '../components/auth/AdminRoute';
import Loader from '../components/common/Loader';
// import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load components for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const RestaurantsPage = lazy(() => import('../pages/RestaurantsPage'));
const RestaurantDetailPage = lazy(() => import('../pages/RestaurantDetailPage'));
// const MenuPage = lazy(() => import('../pages/MenuPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));
const OrderTrackingPage = lazy(() => import('../pages/OrderTrackingPage'));
// const OrderHistoryPage = lazy(() => import('../pages/OrderHistoryPage'));
// const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
// const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
// const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
// const DealsPage = lazy(() => import('../pages/DealsPage'));
// const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
// const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
// const HelpPage = lazy(() => import('../pages/HelpPage'));
// const ContactPage = lazy(() => import('../pages/ContactPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminRestaurants = lazy(() => import('../pages/admin/AdminRestaurants'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

// Restaurant Owner Pages
const RestaurantDashboard = lazy(() => import('../pages/restaurant/RestaurantDashboard'));
const RestaurantOrders = lazy(() => import('../pages/restaurant/RestaurantOrders'));
const RestaurantMenu = lazy(() => import('../pages/restaurant/RestaurantMenu'));
const RestaurantProfile = lazy(() => import('../pages/restaurant/RestaurantProfile'));
const RestaurantAnalytics = lazy(() => import('../pages/restaurant/RestaurantAnalytics'));

// Delivery Pages
const DeliveryDashboard = lazy(() => import('../pages/delivery/DeliveryDashboard'));
const DeliveryOrders = lazy(() => import('../pages/delivery/DeliveryOrders'));
const DeliveryProfile = lazy(() => import('../pages/delivery/DeliveryProfile'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" />
  </div>
);

// Route wrapper with error boundary and suspense
const RouteWrapper = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={
          <RouteWrapper>
            <HomePage />
          </RouteWrapper>
        } />
        
        <Route path="restaurants" element={
          <RouteWrapper>
            <RestaurantsPage />
          </RouteWrapper>
        } />
        
        <Route path="restaurants/:id" element={
          <RouteWrapper>
            <RestaurantDetailPage />
          </RouteWrapper>
        } />
        
        <Route path="restaurants/:id/menu" element={
          <RouteWrapper>
            <MenuPage />
          </RouteWrapper>
        } />
        
        <Route path="search" element={
          <RouteWrapper>
            <SearchPage />
          </RouteWrapper>
        } />
        
        <Route path="categories" element={
          <RouteWrapper>
            <CategoriesPage />
          </RouteWrapper>
        } />
        
        <Route path="categories/:category" element={
          <RouteWrapper>
            <CategoryPage />
          </RouteWrapper>
        } />
        
        <Route path="deals" element={
          <RouteWrapper>
            <DealsPage />
          </RouteWrapper>
        } />
        
        <Route path="about" element={
          <RouteWrapper>
            <AboutPage />
          </RouteWrapper>
        } />
        
        <Route path="contact" element={
          <RouteWrapper>
            <ContactPage />
          </RouteWrapper>
        } />
        
        <Route path="help" element={
          <RouteWrapper>
            <HelpPage />
          </RouteWrapper>
        } />
        
        <Route path="terms" element={
          <RouteWrapper>
            <TermsPage />
          </RouteWrapper>
        } />
        
        <Route path="privacy" element={
          <RouteWrapper>
            <PrivacyPage />
          </RouteWrapper>
        } />

        {/* Protected Routes - Require Authentication */}
        <Route path="cart" element={
          <ProtectedRoute>
            <RouteWrapper>
              <CartPage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="checkout" element={
          <ProtectedRoute>
            <RouteWrapper>
              <CheckoutPage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="order-confirmation/:orderId" element={
          <ProtectedRoute>
            <RouteWrapper>
              <OrderConfirmationPage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="track-order/:orderId" element={
          <ProtectedRoute>
            <RouteWrapper>
              <OrderTrackingPage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="orders" element={
          <ProtectedRoute>
            <RouteWrapper>
              <OrderHistoryPage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <RouteWrapper>
              <ProfilePage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="favorites" element={
          <ProtectedRoute>
            <RouteWrapper>
              <FavoritesPage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="notifications" element={
          <ProtectedRoute>
            <RouteWrapper>
              <NotificationsPage />
            </RouteWrapper>
          </ProtectedRoute>
        } />
      </Route>

      {/* Auth Routes - No Layout */}
      <Route path="login" element={
        <RouteWrapper>
          <LoginPage />
        </RouteWrapper>
      } />
      
      <Route path="register" element={
        <RouteWrapper>
          <RegisterPage />
        </RouteWrapper>
      } />
      
      <Route path="forgot-password" element={
        <RouteWrapper>
          <ForgotPasswordPage />
        </RouteWrapper>
      } />
      
      <Route path="reset-password/:token" element={
        <RouteWrapper>
          <ResetPasswordPage />
        </RouteWrapper>
      } />

      {/* Admin Routes */}
      <Route path="admin" element={
        <AdminRoute>
          <Layout />
        </AdminRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route path="dashboard" element={
          <RouteWrapper>
            <AdminDashboard />
          </RouteWrapper>
        } />
        
        <Route path="restaurants" element={
          <RouteWrapper>
            <AdminRestaurants />
          </RouteWrapper>
        } />
        
        <Route path="orders" element={
          <RouteWrapper>
            <AdminOrders />
          </RouteWrapper>
        } />
        
        <Route path="users" element={
          <RouteWrapper>
            <AdminUsers />
          </RouteWrapper>
        } />
        
        <Route path="analytics" element={
          <RouteWrapper>
            <AdminAnalytics />
          </RouteWrapper>
        } />
        
        <Route path="settings" element={
          <RouteWrapper>
            <AdminSettings />
          </RouteWrapper>
        } />
      </Route>

      {/* Restaurant Owner Routes */}
      <Route path="restaurant-dashboard" element={
        <ProtectedRoute requiredRole="restaurant">
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/restaurant-dashboard/overview" replace />} />
        
        <Route path="overview" element={
          <RouteWrapper>
            <RestaurantDashboard />
          </RouteWrapper>
        } />
        
        <Route path="orders" element={
          <RouteWrapper>
            <RestaurantOrders />
          </RouteWrapper>
        } />
        
        <Route path="menu" element={
          <RouteWrapper>
            <RestaurantMenu />
          </RouteWrapper>
        } />
        
        <Route path="profile" element={
          <RouteWrapper>
            <RestaurantProfile />
          </RouteWrapper>
        } />
        
        <Route path="analytics" element={
          <RouteWrapper>
            <RestaurantAnalytics />
          </RouteWrapper>
        } />
      </Route>

      {/* Delivery Partner Routes */}
      <Route path="delivery-dashboard" element={
        <ProtectedRoute requiredRole="delivery">
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/delivery-dashboard/overview" replace />} />
        
        <Route path="overview" element={
          <RouteWrapper>
            <DeliveryDashboard />
          </RouteWrapper>
        } />
        
        <Route path="orders" element={
          <RouteWrapper>
            <DeliveryOrders />
          </RouteWrapper>
        } />
        
        <Route path="profile" element={
          <RouteWrapper>
            <DeliveryProfile />
          </RouteWrapper>
        } />
      </Route>

      {/* Redirect based on user role */}
      <Route path="dashboard" element={
        <ProtectedRoute>
          <DashboardRedirect user={user} />
        </ProtectedRoute>
      } />

      {/* 404 Page */}
      <Route path="*" element={
        <RouteWrapper>
          <NotFoundPage />
        </RouteWrapper>
      } />
    </Routes>
  );
};

// Component to redirect to appropriate dashboard based on user role
const DashboardRedirect = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'restaurant':
      return <Navigate to="/restaurant-dashboard/overview" replace />;
    case 'delivery':
      return <Navigate to="/delivery-dashboard/overview" replace />;
    default:
      return <Navigate to="/profile" replace />;
  }
};

export default AppRoutes;

