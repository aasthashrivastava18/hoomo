import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStore, FaUtensils, FaTshirt, FaTruck, FaStar, FaUserCircle, FaMoneyBillWave } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Our Platform Works</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your one-stop marketplace for groceries, clothing, and restaurant orders - all in one place!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* For Customers Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">For Customers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Shop from multiple vendors and categories with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaUserCircle className="text-blue-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-gray-600">
                Sign up for free to access all features. Create your profile and save your delivery addresses for faster checkout.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaShoppingCart className="text-blue-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse & Shop</h3>
              <p className="text-gray-600">
                Explore products from multiple categories including groceries, clothing, and restaurant meals. Add items to your cart from different vendors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaTruck className="text-blue-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Your Order</h3>
              <p className="text-gray-600">
                Track your order in real-time. Receive groceries, clothing, and restaurant meals with our efficient delivery system.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link 
              to="/register" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up as a Customer
            </Link>
          </div>
        </section>

        {/* For Vendors Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">For Vendors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expand your business reach and increase sales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vendor Type 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <FaStore className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Grocery Stores</h3>
              <p className="text-gray-600">
                List your grocery products and reach more customers in your area. Manage inventory and track sales easily.
              </p>
            </div>

            {/* Vendor Type 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <FaTshirt className="text-purple-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Clothing Retailers</h3>
              <p className="text-gray-600">
                Showcase your fashion items with detailed descriptions and images. Manage sizes, colors, and inventory.
              </p>
            </div>

            {/* Vendor Type 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                <FaUtensils className="text-red-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Restaurants</h3>
              <p className="text-gray-600">
                List your menu items, manage orders, and expand your delivery reach. Set preparation times and track orders.
              </p>
            </div>

            {/* Vendor Benefits */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
                <FaMoneyBillWave className="text-yellow-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Vendor Benefits</h3>
              <p className="text-gray-600">
                Low commission fees, powerful analytics, and marketing tools to help grow your business.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link 
              to="/vendor/register" 
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Register as a Vendor
            </Link>
          </div>
        </section>

        {/* How the Platform Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Platform Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamless integration between customers and multiple vendor types
            </p>
          </div>

          <div className="relative">
            {/* Process Steps */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="bg-white w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Order Placement</h3>
                <p className="text-gray-600 text-center">
                  Customers browse products from multiple vendors and place orders
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="bg-white w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Vendor Notification</h3>
                <p className="text-gray-600 text-center">
                  Vendors receive and confirm orders through their dashboard
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="bg-white w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Order Preparation</h3>
                <p className="text-gray-600 text-center">
                  Vendors prepare orders for pickup by our delivery partners
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className="bg-white w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Delivery & Feedback</h3>
                <p className="text-gray-600 text-center">
                  Orders are delivered and customers can leave reviews
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied customers and vendors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "I love being able to order groceries, clothes, and dinner all in one place! The delivery is always on time and the quality is excellent."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">SC</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "As a restaurant owner, this platform has helped me reach new customers and increase my delivery orders by 40%. The dashboard is easy to use!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 font-bold">MJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Miguel Johnson</h4>
                  <p className="text-sm text-gray-500">Restaurant Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "My small grocery store now competes with larger chains thanks to this platform. The commission rates are fair and the support team is amazing!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">AP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Aisha Patel</h4>
                  <p className="text-sm text-gray-500">Grocery Store Owner</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">How do I place an order from multiple vendors?</h3>
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>
                      You can add products from different vendors to your cart and check out all at once. 
                      Our system will organize the delivery process for each vendor while providing you 
                      with a unified checkout experience. You'll receive separate delivery updates for 
                      each part of your order.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">What are the delivery fees and times?</h3>
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>
                      Delivery fees vary based on your location, order size, and vendor distance. 
                      Estimated delivery times are shown before checkout and typically range from 
                      30 minutes for restaurant orders to 1-2 days for clothing items. Grocery 
                      deliveries usually arrive within the same day or next day. You can also opt 
                      for scheduled deliveries at your preferred time.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">How do I become a vendor on the platform?</h3>
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>
                      To become a vendor, click on "Register as a Vendor" and complete the application form. 
                      You'll need to provide business details, upload required documents, and select your 
                      vendor category (grocery, clothing, or restaurant). Our team will review your application 
                      within 2-3 business days. Once approved, you can set up your store profile and start 
                      listing products.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">What payment methods are accepted?</h3>
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>
                      We accept all major credit and debit cards, digital wallets (Apple Pay, Google Pay), 
                      and PayPal. Some areas also support cash on delivery. Vendors receive payments directly 
                      to their accounts after order completion, minus our service fee.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">How do returns and refunds work?</h3>
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>
                      Return policies vary by vendor and product type. For groceries, you can report issues 
                      within 24 hours of delivery. Clothing items typically have a 14-day return window. 
                      Restaurant orders can be refunded if reported within 1 hour of delivery. All return 
                      requests are managed through your account's "Orders" section. Once approved, refunds 
                      are processed within 3-5 business days.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and vendors on our platform today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Sign Up as Customer
            </Link>
            <Link 
              to="/vendor/register" 
              className="px-8 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
            >
              Become a Vendor
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;

