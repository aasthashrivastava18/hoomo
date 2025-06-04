import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
// import useCart from '../hooks/useCart';
import { useCart } from '../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
import { useAuth } from "../context/AuthContext";
// import useAuth from '../hooks/useAuth'

const CartPage = () => {
  const { cart, loading, error, updateCartItem, removeCartItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, navigate]);
  
  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };
  
  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };
  
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (err) {
        toast.error('Failed to clear cart');
      }
    }
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning('Please enter a coupon code');
      return;
    }
    try {
    // Call actual coupon service
    const response = await couponService.validateCoupon(couponCode);
    // In a real app, you would validate the coupon with your backend
    
     setDiscount(response.discountPercentage);
    setCouponApplied(true);
      toast.success(`Coupon applied! ${response.discountPercentage}% off`);
  } catch (error) {
    toast.error('Invalid coupon code');
  }
};
  
  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateTax = (subtotal) => {
    return subtotal * 0.05; // 5% tax
  };
  
  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  };
  
  const calculateDiscountAmount = (subtotal) => {
    return couponApplied ? (subtotal * discount / 100) : 0;
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    const discountAmount = calculateDiscountAmount(subtotal);
    return subtotal + tax + shipping - discountAmount;
  };
  
  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FaShoppingCart className="mr-3" /> Your Shopping Cart
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Cart Items ({cart.items.length})</h2>
              <button 
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 text-sm flex items-center"
              >
                <FaTrash className="mr-1" /> Clear Cart
              </button>
            </div>
            
            <div className="divide-y">
              {cart.items.map(item => (
                <CartItem 
                  key={item._id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
            
            <div className="p-4 border-t">
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {calculateShipping(calculateSubtotal()) === 0 
                    ? 'Free' 
                    : `$${calculateShipping(calculateSubtotal()).toFixed(2)}`
                  }
                </span>
              </div>
              
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-${calculateDiscountAmount(calculateSubtotal()).toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {calculateShipping(calculateSubtotal()) === 0 
                    ? 'Including free shipping!' 
                    : 'Add $' + (50 - calculateSubtotal()).toFixed(2) + ' more for free shipping'
                  }
                </p>
              </div>
            </div>
            
            {/* Coupon Code */}
            <div className="mt-6">
              <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                Apply Coupon Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="coupon"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                  className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  className={`px-4 py-2 rounded-r-md ${
                    couponApplied 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-green-600 text-sm mt-1">
                  Coupon "{couponCode}" applied successfully!
                </p>
              )}
            </div>
            
            {/* Checkout Button */}
            <div className="mt-6">
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

