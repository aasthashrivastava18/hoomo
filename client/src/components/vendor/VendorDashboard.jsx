import React from 'react';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Vendor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/vendor/products/add" className="card">➕ Add Product</Link>

        <Link to="/vendor/manage-inventory" className="card">📦 Manage Inventory</Link>
        <Link to="/vendor/orders" className="card">📑 Order Management</Link>
      </div>
    </div>
  );
};

export default VendorDashboard;
