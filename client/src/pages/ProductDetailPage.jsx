import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ProductDetail from '../components/grocery/ProductDetail';
import ProductGrid from '../components/grocery/ProductGrid';
import Breadcrumb from '../components/common/Breadcrumb';
import { getProductById, getRelatedProducts } from '../services/productService';
import Loader from '../components/common/Loader';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);

        // Fetch related products
        if (fetchedProduct?.category) {
          setRelatedLoading(true);
          try {
            const relatedProducts = await getRelatedProducts(
              fetchedProduct.category, 
              productId // Exclude current product
            );
            setRelated(relatedProducts || []);
          } catch (relatedError) {
            console.error('Error loading related products:', relatedError);
            // Don't show error for related products, just log it
          } finally {
            setRelatedLoading(false);
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message || 'Failed to load product details. Please try again.');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
      { label: 'Grocery', path: '/grocery' }
    ];

    if (product?.category) {
      items.push({
        label: product.category.charAt(0).toUpperCase() + product.category.slice(1),
        path: `/grocery?category=${product.category}`
      });
    }

    if (product?.name) {
      items.push({
        label: product.name,
        path: `/product/${productId}`,
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
          <p className="mt-4 text-gray-600">Loading product details...</p>
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
              Unable to Load Product
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
                to="/grocery"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center"
              >
                <FaShoppingCart className="inline mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-6xl mb-4">🔍❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or may have been removed.
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
                to="/grocery"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
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
            Back to Products
          </button>
        </div>

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-sm mb-12">
          <ProductDetail product={product} />
        </div>

        {/* Related Products Section */}
        {(related.length > 0 || relatedLoading) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Products
              </h2>
              {product.category && (
                <Link
                  to={`/grocery?category=${product.category}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All in {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
              )}
            </div>

            {relatedLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : related.length > 0 ? (
              <ProductGrid products={related} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No related products found.</p>
                <Link
                  to="/grocery"
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/grocery"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            <FaShoppingCart className="inline mr-2" />
            Continue Shopping
          </Link>
          
          {product.category && (
            <Link
              to={`/grocery?category=${product.category}`}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              More in {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

