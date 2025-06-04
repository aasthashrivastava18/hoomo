import React from 'react';

const Analytics = () => {
  // Placeholder data, replace with actual data fetching logic
  const data = {
    dailyOrders: 120,
    activeUsers: 300,
    topSellingProduct: 'Blue T-shirt',
    peakHours: '6 PM - 9 PM',
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
      <ul className="space-y-2">
        <li><strong>Daily Orders:</strong> {data.dailyOrders}</li>
        <li><strong>Active Users:</strong> {data.activeUsers}</li>
        <li><strong>Top Selling Product:</strong> {data.topSellingProduct}</li>
        <li><strong>Peak Hours:</strong> {data.peakHours}</li>
      </ul>
    </div>
  );
};

export default Analytics;
