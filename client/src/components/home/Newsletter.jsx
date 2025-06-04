import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-16 bg-green-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-green-100 mb-8">Subscribe to get special offers and updates</p>
        <div className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-l-md"
          />
          <button className="bg-green-800 text-white px-6 py-2 rounded-r-md hover:bg-green-900">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
