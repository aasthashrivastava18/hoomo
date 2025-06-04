import React from 'react';
import { FaShoppingCart, FaTruck, FaTag } from 'react-icons/fa';

const OrderSummary = ({ 
  items = [], 
  subtotal = 0, 
  shipping = 0, 
  tax = 0, 
  discount = 0, 
  total = 0,
  promoCode = '',
  onPromoCodeChange,
  onApplyPromoCode,
  promoCodeLoading = false,
  promoCodeError = ''
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FaShoppingCart className="mr-2 text-blue-600" />
        Order Summary
      </h3>

      {/* Items List */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={item.image || '/placeholder-product.jpg'}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                ${item.price.toFixed(2)} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaTag className="inline mr-1" />
          Promo Code
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => onPromoCodeChange && onPromoCodeChange(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={onApplyPromoCode}
            disabled={promoCodeLoading || !promoCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promoCodeLoading ? 'Applying...' : 'Apply'}
          </button>
        </div>
        {promoCodeError && (
          <p className="text-red-500 text-sm mt-1">{promoCodeError}</p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <FaTruck className="mr-1" />
            Shipping
          </span>
          <span className="text-gray-900">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {shipping === 0 && subtotal > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 flex items-center">
            <FaTruck className="mr-2" />
            Congratulations! You qualify for free shipping.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
