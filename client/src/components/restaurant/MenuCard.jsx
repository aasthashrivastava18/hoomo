import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaMinus, FaStar, FaLeaf, FaFire, FaHeart, FaRegHeart, FaClock } from 'react-icons/fa';
// import { addToCart, updateQuantity } from '../redux/slices/cartSlice';
// import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-hot-toast';
import Modal from './common/Modal';

const MenuCard = ({ item, restaurantId, className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(item.variants?.[0] || null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const cartItem = cartItems.find(cartItem => 
    cartItem.id === item.id && 
    cartItem.restaurantId === restaurantId
  );
  const quantity = cartItem?.quantity || 0;
  
  const isInWishlist = wishlistItems.some(wishItem => 
    wishItem.id === item.id && wishItem.type === 'menu-item'
  );
  
  const currentPrice = selectedVariant?.price || item.price;
  const addonsPrice = selectedAddons.reduce((total, addon) => total + addon.price, 0);
  const totalPrice = currentPrice + addonsPrice;
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    const cartItemData = {
      id: item.id,
      name: item.name,
      price: currentPrice,
      image: item.image,
      restaurantId: restaurantId,
      restaurantName: item.restaurantName,
      variant: selectedVariant,
      addons: selectedAddons,
      specialInstructions: specialInstructions,
      totalPrice: totalPrice
    };
    
    dispatch(addToCart(cartItemData));
    toast.success('Added to cart');
    setShowModal(false);
    resetSelections();
  };
  
  const handleUpdateQuantity = (newQuantity) => {
    if (!isAuthenticated) {
      toast.error('Please login to modify cart');
      return;
    }
    
    if (newQuantity === 0) {
      dispatch(updateQuantity({ id: item.id, restaurantId, quantity: 0 }));
      toast.success('Removed from cart');
    } else {
      dispatch(updateQuantity({ id: item.id, restaurantId, quantity: newQuantity }));
    }
  };
  
  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist({ id: item.id, type: 'menu-item' }));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist({ ...item, type: 'menu-item', restaurantId }));
      toast.success('Added to wishlist');
    }
  };
  
  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };
  
  const resetSelections = () => {
    setSelectedVariant(item.variants?.[0] || null);
    setSelectedAddons([]);
    setSpecialInstructions('');
  };
  
  const openCustomizationModal = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    if (item.variants?.length > 0 || item.addons?.length > 0) {
      setShowModal(true);
    } else {
      handleAddToCart();
    }
  };
  
  const getBadgeColor = (type) => {
    switch (type) {
      case 'bestseller': return 'bg-orange-500 text-white';
      case 'new': return 'bg-green-500 text-white';
      case 'spicy': return 'bg-red-500 text-white';
      case 'vegetarian': return 'bg-green-100 text-green-800';
      case 'vegan': return 'bg-green-200 text-green-900';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
        <div className="flex">
          {/* Item Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150x150?text=Food+Item';
              }}
            />
            
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? (
                <FaHeart className="h-4 w-4 text-red-500" />
              ) : (
                <FaRegHeart className="h-4 w-4 text-gray-600" />
              )}
            </button>
            
            {/* Badges */}
            <div className="absolute bottom-2 left-2 flex flex-col gap-1">
              {item.isVegetarian && (
                <span className="p-1 bg-green-100 rounded-full">
                  <FaLeaf className="h-3 w-3 text-green-600" />
                </span>
              )}
              {item.isSpicy && (
                <span className="p-1 bg-red-100 rounded-full">
                  <FaFire className="h-3 w-3 text-red-600" />
                </span>
              )}
            </div>
          </div>
          
          {/* Item Details */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.name}
                </h3>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.badges?.map((badge, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(badge.type)}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
                
                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center mb-2">
                    <FaStar className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({item.reviewCount || 0})
                    </span>
                  </div>
                )}
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Preparation Time */}
                {item.prepTime && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaClock className="h-4 w-4 mr-1" />
                    <span>{item.prepTime} mins</span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Add to Cart Controls */}
                  <div className="flex items-center">
                    {quantity > 0 ? (
                      <div className="flex items-center bg-green-100 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(quantity - 1)}
                          className="p-2 text-green-600 hover:bg-green-200 rounded-l-lg transition-colors"
                        >
                          <FaMinus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-2 text-green-700 font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(quantity + 1)}
                          className="p-2 text-green-600 hover:bg-green-200 rounded-r-lg transition-colors"
                        >
                          <FaPlus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={openCustomizationModal}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaPlus className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customization Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Customize ${item.name}`}
        size="md"
      >
        <div className="space-y-6">
          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Choose Size/Variant
              </h4>
              <div className="space-y-2">
                {item.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        checked={selectedVariant?.id === variant.id}
                        onChange={() => setSelectedVariant(variant)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">{variant.name}</span>
                        {variant.description && (
                          <p className="text-sm text-gray-600">{variant.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-medium">${variant.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Add-ons (Optional)
              </h4>
              <div className="space-y-2">
                {item.addons.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAddons.some(a => a.id === addon.id)}
                        onChange={() => handleAddonToggle(addon)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">{addon.name}</span>
                        {addon.description && (
                          <p className="text-sm text-gray-600">{addon.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-medium">+${addon.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Special Instructions */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Special Instructions (Optional)
            </h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests or dietary requirements..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
          
          {/* Total and Add Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-lg font-bold text-gray-900">
              Total: ${totalPrice.toFixed(2)}
            </div>
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MenuCard;
