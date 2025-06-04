import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaShare } from 'react-icons/fa';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { getClothingItemById } from '../services/clothesService';
import { addToCart } from '../services/cartService';
import { toast } from 'react-toastify';
// import useAuth from '../hooks/useAuth';
// import useCart from '../hooks/useCart';

const ClothesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  
  const [clothing, setClothing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  useEffect(() => {
    const fetchClothingItem = async () => {
      try {
        setLoading(true);
        const data = await getClothingItemById(id);
        setClothing(data);
        // Set default selections if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load clothing details. Please try again.');
        console.error('Error fetching clothing item:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClothingItem();
  }, [id]);
  
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to your cart');
      navigate('/login', { state: { from: `/clothes/${id}` } });
      return;
    }
    
    if (!selectedSize) {
      toast.warning('Please select a size');
      return;
    }
    
    if (!selectedColor) {
      toast.warning('Please select a color');
      return;
    }
    
    try {
      await addToCart({
        itemId: clothing._id,
        itemType: 'clothes',
        quantity,
        size: selectedSize,
        color: selectedColor
      });
      toast.success('Item added to cart!');
      refreshCart();
    } catch (err) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };
  
  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  if (!clothing) return <Alert type="error" message="Clothing item not found" />;
  
  const discountedPrice = clothing.discount 
    ? clothing.price - (clothing.price * clothing.discount / 100) 
    : clothing.price;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={clothing.images && clothing.images.length > 0 
                ? clothing.images[activeImage] 
                : '/assets/images/not-found.png'
              } 
              alt={clothing.name}
              className="w-full h-96 object-contain"
            />
          </div>
          
          {clothing.images && clothing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {clothing.images.map((image, index) => (
                <div 
                  key={index}
                  className={`w-20 h-20 border-2 rounded cursor-pointer ${
                    activeImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${clothing.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <div className="mb-2">
            <span className="text-sm text-gray-500">{clothing.category}</span>
            <h1 className="text-3xl font-bold">{clothing.name}</h1>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400 mr-2">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar 
                  key={star} 
                  className={star <= (clothing.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {clothing.ratings?.count || 0} reviews
            </span>
          </div>
          
          <div className="mb-6">
            {clothing.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 mr-2">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${clothing.price.toFixed(2)}
                </span>
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                  {clothing.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${clothing.price.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{clothing.description}</p>
          </div>
          
          {/* Size Selection */}
          {clothing.sizes && clothing.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {clothing.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Color Selection */}
          {clothing.colors && clothing.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {clothing.colors.map(color => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-500' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
            <div className="flex items-center">
              <button 
                className="w-10 h-10 border rounded-l-md flex items-center justify-center"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 border-t border-b text-center"
              />
              <button 
                className="w-10 h-10 border rounded-r-md flex items-center justify-center"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md"
            >
              Buy Now
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-semibold">Brand:</span> {clothing.brand}
              </div>
              <div>
                                <span className="font-semibold">In Stock:</span> {clothing.stock > 0 ? `${clothing.stock} items` : 'Out of stock'}
              </div>
              <div>
                <span className="font-semibold">Gender:</span> {clothing.gender}
              </div>
            </div>
            
            <div className="flex mt-4 gap-4">
              <button className="flex items-center text-gray-600 hover:text-red-500">
                <FaHeart className="mr-1" /> Wishlist
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <FaShare className="mr-1" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {clothing.reviews && clothing.reviews.length > 0 ? (
          <div className="space-y-6">
            {clothing.reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar 
                        key={star} 
                        className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{review.user.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
        
        {isAuthenticated && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            {/* Review form would go here */}
            <p className="text-sm text-gray-500">
              You need to purchase this product before writing a review.
            </p>
          </div>
        )}
      </div>
      
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        {/* Related products would go here */}
        <p className="text-gray-500">Loading related products...</p>
      </div>
    </div>
  );
};

export default ClothesDetailPage;

