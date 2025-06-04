import React from 'react';
import Analytics from './Analytics';
import ManageClothes from './ManageClothes';
import ManageProducts from './ManageProducts';
import ManageRestaurants from './ManageRestaurants';
import StockManagement from './StockManagement';
import VendorRequests from './VendorRequests';

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <section className="mb-8">
        <Analytics />
      </section>
      
      <section className="mb-8">
        <ManageClothes />
      </section>
      
      <section className="mb-8">
        <ManageProducts />
      </section>
      
      <section className="mb-8">
        <ManageRestaurants />
      </section>
      
      <section className="mb-8">
        <StockManagement />
      </section>
      
      <section>
        <VendorRequests />
      </section>
    </div>
  );
};

export default AdminDashboard;
