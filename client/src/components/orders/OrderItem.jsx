import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaTruck, 
  FaBox, 
  FaStore, 
  FaUtensils, 
  FaTshirt, 
  FaMapMarkerAlt,
  FaReceipt,
  FaStar,
  FaExclamationCircle
} from 'react-icons/fa';

const OrderItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time to readable format
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Calculate total items in the order
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'processing':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'preparing':
        return <FaBox className="text-blue-500" />;
      case 'ready_for_pickup':
        return <FaStore className="text-purple-500" />;
      case 'out_for_delivery':
        return <FaTruck className="text-orange-500" />;
      case 'pending_payment':
        return <FaExclamationCircle className="text-red-400" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  // Get status text based on order status
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'processing':
        return 'Processing';
      case 'preparing':
        return 'Preparing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'pending_payment':
        return 'Payment Pending';
      default:
        return 'Processing';
    }
  };

  // Get vendor icon based on vendor type
  const getVendorIcon = (type) => {
    switch (type) {
      case 'grocery':
        return <FaStore className="text-green-500" />;
      case 'restaurant':
        return <FaUtensils className="text-red-500" />;
      case 'clothing':
        return <FaTshirt className="text-purple-500" />;
      default:
        return <FaStore className="text-blue-500" />;
    }
  };

  // Check if order can be reordered
  const canReorder = ['completed', 'cancelled'].includes(order.status);

  // Check if order can be cancelled
  const canCancel = ['processing', 'preparing'].includes(order.status);

  // Check if order can be reviewed
  const canReview = order.status === 'completed' && !order.reviewed;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200">
      {/* Order Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="mr-3">
              {getStatusIcon(order.status)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
              <p className="text-sm text-gray-500">
                {formatDate(order.date)} at {formatTime(order.date)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
            <div className="mr-4 sm:mr-6">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                order.status === 'pending_payment' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse order details" : "Expand order details"}
            >
              {expanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Order Summary (always visible) */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="flex -space-x-2 mr-3">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40?text=Item';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                      {getVendorIcon(item.vendorType)}
                    </div>
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
              <p className="text-xs text-gray-500">
                From {order.vendors.length === 1 
                  ? `${order.vendors[0].name}` 
                  : `${order.vendors.length} vendors`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Order Details */}
      {expanded && (
        <div className="p-4 border-b border-gray-200">
          {/* Order Items */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40?text=Item';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                          {getVendorIcon(item.vendorType)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{getVendorIcon(item.vendorType)}</span>
                        <span className="ml-1">{item.vendorName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">${item.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Information</h4>
              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">{order.deliveryAddress}</p>
                    {order.deliveryNotes && (
                      <p className="text-xs text-gray-500 mt-1">Note: {order.deliveryNotes}</p>
                    )}
                  </div>
                </div>
                {order.estimatedDelivery && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {order.status === 'completed' 
                        ? 'Delivered on' 
                        : 'Estimated delivery'}:
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(order.estimatedDelivery)} between {formatTime(order.estimatedDelivery)} - {formatTime(new Date(new Date(order.estimatedDelivery).getTime() + 60 * 60 * 1000))}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Summary</h4>
              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="text-gray-800">${order.deliveryFee.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">Discount:</span>
                    <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-800">${order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-sm pt-2 mt-2 border-t border-gray-100">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Actions */}
      <div className="p-4 flex flex-wrap gap-2">
        <Link 
          to={`/track-order/${order.id}`} 
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          <FaTruck className="mr-1.5 text-gray-500" />
          Track Order
        </Link>
        
        <Link 
          to={`/orders/${order.id}`} 
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          <FaReceipt className="mr-1.5 text-gray-500" />
          View Details
        </Link>
        
        {canReorder && (
          <button 
                 className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded text-blue-600 bg-white hover:bg-blue-50"
          >
            <FaStore className="mr-1.5" />
            Reorder
          </button>
        )}
        
        {canCancel && (
          <button 
            className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded text-red-600 bg-white hover:bg-red-50"
          >
            <FaTimesCircle className="mr-1.5" />
            Cancel Order
          </button>
        )}
        
        {canReview && (
          <button 
            className="inline-flex items-center px-3 py-1.5 border border-yellow-500 text-sm font-medium rounded text-yellow-600 bg-white hover:bg-yellow-50"
          >
            <FaStar className="mr-1.5" />
            Write Review
          </button>
        )}
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        image: PropTypes.string,
        vendorName: PropTypes.string,
        vendorType: PropTypes.string
      })
    ).isRequired,
    vendors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
    deliveryFee: PropTypes.number.isRequired,
    discount: PropTypes.number,
    tax: PropTypes.number,
    paymentMethod: PropTypes.string.isRequired,
    deliveryAddress: PropTypes.string.isRequired,
    deliveryNotes: PropTypes.string,
    estimatedDelivery: PropTypes.string,
    reviewed: PropTypes.bool
  }).isRequired
};

export default OrderItem;
